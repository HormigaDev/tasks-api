import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesService } from './roles.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions, PermissionsDict } from 'src/common/enums/Permissions.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CreateRoleDto } from './DTOs/create-role.dto';
import { UpdateRoleDto } from 'src/modules/roles/DTOs/update-role.dto';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { RoleFindFilters } from './DTOs/role-find-filters.dto';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Roles')
@ApiBearerAuth('jwt-token')
@Controller('roles')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class RolesController {
    constructor(
        private readonly service: RolesService,
        private readonly usersService: UsersService,
    ) {}

    @Get('/get-permissions')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadRoles, Permissions.CreateRoles])
    @ApiOperation({ summary: 'Listar permisos disponibles para el usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Permisos obtenidos correctamente' })
    async getPermissions(@Req() req: Request) {
        const userId: number = req['user']['userId'];
        const user = await this.usersService.findById(userId, { includeRoles: true });
        const allPermissions = { ...PermissionsDict };

        const permissions = allPermissions.filter((perm) => {
            perm.id = String(perm.id) as unknown as bigint;
            const isAdmin = user.hasPermission(Permissions.Admin);
            return isAdmin || (BigInt(user.permissions) & BigInt(perm.id)) === BigInt(perm.id);
        });

        return { permissions };
    }

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadRoles])
    @ApiOperation({ summary: 'Obtener lista de roles con filtros' })
    @ApiQuery({ name: 'filters', type: RoleFindFilters, required: false })
    @ApiResponse({ status: 200, description: 'Listado de roles obtenido correctamente' })
    async getRoles(@Query() filters: RoleFindFilters) {
        const [roles, count] = await this.service.find(filters);
        return { roles, count };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateRoles])
    @ApiOperation({ summary: 'Crear un nuevo rol' })
    @ApiResponse({ status: 201, description: 'Rol creado correctamente' })
    async createRole(@Body() body: CreateRoleDto) {
        const role = await this.service.create(body);
        role.permissions = String(role.permissions) as unknown as bigint;
        return { role };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateRoles])
    @ApiOperation({ summary: 'Actualizar un rol existente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del rol a actualizar' })
    @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
    async updateRole(@Body() body: UpdateRoleDto, @Param('id', IdPipe) id: number) {
        await this.service.findOne(id);
        await this.service.update(id, body);
        return { message: 'Rol actualizado con éxito' };
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteRoles])
    @ApiOperation({ summary: 'Eliminar un rol por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del rol a eliminar' })
    @ApiResponse({ status: 204, description: 'Rol eliminado correctamente' })
    async deleteRole(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
