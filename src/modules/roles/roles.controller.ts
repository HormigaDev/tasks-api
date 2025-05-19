import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesService } from './roles.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions, PermissionsDict } from 'src/common/enums/Permissions.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CreateRoleDto } from 'src/common/validators/create-role.dto';
import { UpdateRoleDto } from 'src/common/validators/update-role.dto';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class RolesController {
    constructor(
        private readonly service: RolesService,
        private readonly usersService: UsersService,
    ) {}

    //TODO: Verificar el intuito de este endpoint
    @Get('/get-permissions')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadRoles, Permissions.CreateRoles])
    async getPermissions(@Req() req: Request) {
        const userId: number = req['user']['userId'];
        const user = await this.usersService.findById(userId, true);
        const permissions = PermissionsDict.filter((perm) => {
            return (user.permissions & perm.id) === perm.id;
        });

        return { permissions };
    }

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadRoles])
    async getRoles() {}

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateRoles])
    async createRole(@Body() body: CreateRoleDto) {
        const role = await this.service.create(body);
        return { role };
    }

    @Put('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.UpdateRoles])
    async updateRole(@Body() body: UpdateRoleDto, @Param('id', IdPipe) id: number) {
        await this.service.findOne(id);
        await this.service.update(id, body);
        return {};
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteRoles])
    async deleteRole(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
