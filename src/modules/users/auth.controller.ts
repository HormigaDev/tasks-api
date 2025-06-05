import {
    Body,
    Controller,
    HttpCode,
    Post,
    UnauthorizedException,
    Patch,
    Req,
    Res,
    Inject,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from 'src/modules/users/DTOs/login.dto';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
import { ChangePasswordDto } from 'src/modules/users/DTOs/change-password.dto';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Times } from 'src/common/Times';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiCookieAuth,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { ContextService } from '../context/context.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly MAX_ATTEMPTS = 5;
    private readonly BLOCK_TIME = 16 * 60;

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly context: ContextService,
        @Inject('CACHE_MANAGER') private cacheManager: Cache,
    ) {}

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Autenticación de usuarios' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Autenticación exitosa' })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas o cuenta bloqueada temporalmente',
    })
    async login(@Body() body: LoginDto, @Res() res: Response) {
        const user = await this.usersService.findOneByEmail(body.email);
        if (!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const cacheKey = `login_attempts:${body.email}`;
        const failedAttempts = (await this.cacheManager.get<number>(cacheKey)) || 0;

        if (failedAttempts >= this.MAX_ATTEMPTS) {
            throw new UnauthorizedException(
                'Demasiados intentos fallidos. Inténtalo más tarde o contacta al personal de soporte.',
            );
        }

        if (await this.authService.passwordIsEqual(body.password, user.password)) {
            await this.cacheManager.del(cacheKey);
            const token = await this.authService.generateToken({ userId: user.id });

            const strategyType = process.env.JWT_STRATEGY || 'bearer';

            if (strategyType === 'cookie') {
                res.cookie('auth_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: Times.years(1),
                    sameSite: 'none',
                });
                return res.status(200).send({ message: 'Authentication successful' });
            } else {
                return res.status(200).json({ token });
            }
        } else {
            await this.cacheManager.set(cacheKey, failedAttempts + 1, this.BLOCK_TIME);
            throw new UnauthorizedException('Invalid Credentials');
        }
    }

    @Patch('/change-password')
    @HttpCode(204)
    @ApiOperation({ summary: 'Cambiar contraseña' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({ status: 204, description: 'Contraseña cambiada exitosamente' })
    @ApiResponse({
        status: 401,
        description: 'Contraseña anterior incorrecta o demasiados intentos fallidos',
    })
    @ApiBearerAuth()
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
    @RequirePermissions([Permissions.UpdateMySelf])
    async changePassword(@Body() body: ChangePasswordDto) {
        const cacheKey = `change_password_attempts:${this.context.user.id}`;
        const user = await this.usersService.findById(this.context.user.id);
        const failedAttempts = (await this.cacheManager.get<number>(cacheKey)) || 0;
        if (failedAttempts >= this.MAX_ATTEMPTS) {
            throw new UnauthorizedException(
                'Demasiados intentos fallidos, intentalo de nuevo más tarde.',
            );
        }
        if (!(await this.authService.passwordIsEqual(body.previousPassword, user.password))) {
            await this.cacheManager.set(cacheKey, failedAttempts + 1, this.BLOCK_TIME);
            throw new UnauthorizedException('Contraseña anterior incorrecta.');
        }
        await this.cacheManager.del(cacheKey);
        await this.usersService.setUserPassword(user.id, body.newPassword);

        return {};
    }
}
