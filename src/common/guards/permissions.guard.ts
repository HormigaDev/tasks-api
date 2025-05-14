import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';
import { UserStatus } from '../enums/UserStatus.enum';
import { RolesService } from 'src/modules/roles/roles.service';
import { Permissions } from '../enums/Permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { permissions, optional } = this.reflector.get<{
            permissions: number[];
            optional: boolean;
        }>('permissions', context.getHandler()) || { permissions: [], optional: false };
        if (!permissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;

        if (!userId) {
            throw new ForbiddenException('Usuario no encontrado.');
        }

        const user = await this.usersService.findOne(userId, true);
        if (user.status !== UserStatus.Active) {
            throw new ForbiddenException('Usuario no activo.');
        }

        if ((user.permissions & Permissions.Admin) === Permissions.Admin) {
            return true;
        }
        if (optional) {
            if (
                permissions.some((perm) => {
                    return (user.permissions & perm) === perm;
                })
            ) {
                return true;
            } else {
                throw new ForbiddenException('Permisos insuficientes.');
            }
        } else {
            if (
                permissions.every((perm) => {
                    return (user.permissions & perm) === perm;
                })
            ) {
                return true;
            } else {
                throw new ForbiddenException('Permisos insuficientes.');
            }
        }
    }
}
