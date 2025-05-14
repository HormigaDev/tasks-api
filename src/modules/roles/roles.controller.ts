import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesService } from './roles.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions, PermissionsDict } from 'src/common/enums/Permissions.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { PaginationInterface } from 'src/common/interfaces/pagination.interface';
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
        private readonly rolesService: RolesService,
        private readonly usersService: UsersService,
    ) {}

    @Get('/get-permissions')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadRoles, Permissions.CreateRoles])
    async getPermissions(@Req() req: Request) {
        const userId: number = req['user']['userId'];
        const user = await this.usersService.findOne(userId, true);
        const permissions = PermissionsDict.filter((perm) => {
            return (user.permissions & perm.id) === perm.id;
        });

        return { permissions };
    }

    @Get('/all')
    @HttpCode(200)
    @RequirePermissions([Permissions.Admin])
    async getAllRoles(@Query('pagination', PaginationPipe) pagination: PaginationInterface) {
        const roles = await this.rolesService.findAll(pagination);
        return { roles };
    }

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadRoles])
    async getRoles(
        @Query('pagination', PaginationPipe) pagination: PaginationInterface,
        @Req() req: Request,
    ) {
        const userId: number = req['user']['userId'];
        const roles = await this.rolesService.findRoles(userId, pagination);
        return { roles };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateRoles])
    async createRole(@Body() body: CreateRoleDto) {
        const role = await this.rolesService.create(body);
        return { role };
    }

    @Put('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.UpdateRoles])
    async updateRole(@Body() body: UpdateRoleDto, @Param('id', IdPipe) id: number) {
        await this.rolesService.findOne(id);
        await this.rolesService.update(id, body);
        return {};
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteRoles])
    async deleteRole(@Param('id', IdPipe) id: number) {
        await this.rolesService.delete(id);
        return {};
    }
}
