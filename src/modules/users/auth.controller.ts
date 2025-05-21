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
import { LoginDto } from 'src/common/validators/login.dto';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
import { ChangePasswordDto } from 'src/common/validators/change-password.dto';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Times } from 'src/common/Times';

@Controller('auth')
export class AuthController {
    private readonly MAX_ATTEMPTS = 5;
    private readonly BLOCK_TIME = 16 * 60;

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        @Inject('CACHE_MANAGER') private cacheManager: Cache,
    ) {}

    @Post('login')
    @HttpCode(200)
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
                return { token };
            }
        } else {
            await this.cacheManager.set(cacheKey, failedAttempts + 1, this.BLOCK_TIME);
            throw new UnauthorizedException('Invalid Credentials');
        }
    }

    @Patch('/change-password')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
    @RequirePermissions([Permissions.UpdateMySelf])
    async changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
        const userId: number = req['user']['userId'];
        const cacheKey = `change_password_attempts:${userId}`;
        const user = await this.usersService.findById(userId);
        const failedAttempts = (await this.cacheManager.get<number>(cacheKey)) || 0;
        if (failedAttempts >= this.MAX_ATTEMPTS) {
            throw new UnauthorizedException(
                'Demasiados intentos fallidos, intentalo de nuevo más tarde.',
            );
        }
        if (!(await this.authService.passwordIsEqual(body.previusPassword, user.password))) {
            await this.cacheManager.set(cacheKey, failedAttempts + 1, this.BLOCK_TIME);
            throw new UnauthorizedException('Contraseña anterior incorrecta.');
        }
        await this.cacheManager.del(cacheKey);
        await this.usersService.setUserPassword(user.id, body.newPassword);

        return {};
    }
}
