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
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { UsersService } from './users.service';
import { ContextService } from '../context/context.service';
import { UserStatus } from 'src/database/model/entities/user-status.entity';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';
import { UpdateUserRolesDto } from './DTOs/update-user-roles.dto';
import { UserFindFilters } from './DTOs/user-find-filters.dto';

@ApiTags('Users')
@ApiBearerAuth('jwt-token')
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
    @ApiOperation({ summary: 'Obtener listado de usuarios con filtros' })
    @ApiQuery({ name: 'filters', type: UserFindFilters, required: false })
    @ApiResponse({ status: 200, description: 'Listado de usuarios obtenido correctamente' })
    async getUsers(@Query() filters: UserFindFilters) {
        const [users, count] = await this.service.find(filters);
        return { users, count };
    }

    @Get('/me')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadMySelf])
    @ApiOperation({ summary: 'Obtener información del usuario actual' })
    @ApiResponse({ status: 200, description: 'Información del usuario obtenida correctamente' })
    async getInfo() {
        const userId = this.context.user.id;
        const user = await this.service.findById(userId, { includeRoles: true });

        user.permissions = String(user.permissions) as unknown as bigint;
        delete user.password;

        return { user };
    }

    @Get('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadUsers])
    @ApiOperation({ summary: 'Obtener información de un usuario por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Información del usuario obtenida correctamente' })
    async getUserInfo(@Param('id', IdPipe) id: number) {
        const user = await this.service.findById(id, { includeRoles: true });

        user.permissions = String(user.permissions) as unknown as bigint;
        delete user.password;

        return { user };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateUsers])
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.service.create(body);
        delete user.password;
        return { user };
    }

    @Patch('/me')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateMySelf])
    @ApiOperation({ summary: 'Actualizar datos del usuario actual' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente' })
    async updateMySelfUser(@Body() body: UpdateUserDto) {
        delete body.roles;
        await this.service.update(this.context.user.id, body);
        return { message: 'Usuario actualizado con éxito' };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateUsers])
    @ApiOperation({ summary: 'Actualizar información de un usuario por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente' })
    async updateUser(@Body() body: UpdateUserDto, @Param('id', IdPipe) id: number) {
        await this.service.update(id, body);
        return { message: 'Usuario actualizado con éxito' };
    }

    @Put('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateUsers])
    @ApiOperation({ summary: 'Actualizar roles de un usuario' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Roles del usuario actualizados correctamente' })
    async updateUserRoles(@Body() body: UpdateUserRolesDto, @Param('id', IdPipe) id: number) {
        await this.service.updateUserRoles(id, body.roles);
        return { message: 'Roles actualizados con éxito' };
    }

    @Put('/me/inactive')
    @HttpCode(204)
    @RequirePermissions([Permissions.UpdateMySelf])
    @ApiOperation({ summary: 'Desactivar mi usuario' })
    @ApiResponse({ status: 204, description: 'Usuario desactivado correctamente' })
    async inactiveUser() {
        await this.service.setUserStatus(this.context.user.id, UserStatus.inactive);
        return {};
    }

    @Delete('/me')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteMySelf])
    @ApiOperation({ summary: 'Eliminar mi propio usuario' })
    @ApiResponse({ status: 204, description: 'Usuario eliminado correctamente' })
    async deleteMySelf() {
        await this.service.delete(this.context.user.id);
        return {};
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteUsers])
    @ApiOperation({ summary: 'Eliminar un usuario por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
    @ApiResponse({ status: 204, description: 'Usuario eliminado correctamente' })
    async deleteUser(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
