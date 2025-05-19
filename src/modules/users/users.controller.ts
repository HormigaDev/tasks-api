import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { Request } from 'express';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CreateUserDto } from 'src/modules/users/DTOs/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/DTOs/update-user.dto';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { UserFindFilters } from './DTOs/user-find-filters.dto';
import { ContextService } from '../context/context.service';
import { UserStatus } from 'src/database/model/entities/user-status.entity';
import { UpdateUserRolesDto } from './DTOs/update-user-roles.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class UsersController {
    constructor(
        private readonly service: UsersService,
        private readonly context: ContextService,
    ) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadUsers])
    async getUsers(@Query() filters: UserFindFilters) {
        const [users, count] = await this.service.find(filters);
        return { users, count };
    }

    @Get('/me')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadMySelf])
    async getInfo(@Req() req: Request) {
        const userId: number = req['user']['userId'];
        const user = await this.service.findById(userId, { includeRoles: true });
        delete user.password;
        return { user };
    }

    @Get('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadUsers])
    async getUserInfo(@Param('id', IdPipe) id: number) {
        const user = await this.service.findById(id, { includeRoles: true });
        delete user.password;
        return { user };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateUsers])
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.service.create(body);
        delete user.password;
        return { user };
    }

    @Put('/me/inactive')
    @HttpCode(204)
    @RequirePermissions([Permissions.UpdateMySelf])
    async inactiveUser() {
        await this.service.setUserStatus(this.context.userId, UserStatus.inactive);
        return {};
    }

    @Patch('/me')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateMySelf])
    async updateMySelfUser(@Body() body: UpdateUserDto) {
        delete body.roles;
        await this.service.update(this.context.userId, body);
        return { message: 'Usuario actualizado con éxito' };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateUsers])
    async updateUser(@Body() body: UpdateUserDto, @Param('id', IdPipe) id: number) {
        await this.service.update(id, body);
        return { message: 'Usuario actualizado con éxito' };
    }

    @Put('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateUsers])
    async updateUserRoles(@Body() body: UpdateUserRolesDto, @Param('id', IdPipe) id: number) {
        await this.service.updateUserRoles(id, body.roles);
        return { message: 'Usuario actualizado con éxito' };
    }

    @Delete('/me')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteMySelf])
    async deleteMySelf() {
        await this.service.delete(this.context.userId);
        return {};
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteUsers])
    async deleteUser(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
