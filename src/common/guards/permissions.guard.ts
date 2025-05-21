import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';
import { Permissions } from '../enums/Permissions.enum';
import { UserStatus } from 'src/database/model/entities/user-status.entity';
import { PERMISSION_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { permissions, optional } = this.reflector.get<{
            permissions: number[];
            optional: boolean;
        }>(PERMISSION_KEY, context.getHandler()) || { permissions: [], optional: false };
        if (!permissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;

        if (!userId) {
            throw new ForbiddenException('Usuario no encontrado.');
        }

        const user = await this.usersService.findById(userId, { includeRoles: true });
        if (user.status.id !== UserStatus.Active) {
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
