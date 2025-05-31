import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PERMISSION_KEY } from './require-permissions.decorator'; // Asegurate del path correcto
import { User } from 'src/database/model/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';

export const AuthUserWs = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
    const client = ctx.switchToWs().getClient() as { user?: User };
    const user = client.user;

    if (!user) {
        throw new WsException('Usuario no autenticado');
    }

    const reflector = new Reflector();
    const meta = reflector.get<{ permissions: bigint[]; optional: boolean }>(
        PERMISSION_KEY,
        ctx.getHandler(),
    );

    if (meta && meta.permissions && Array.isArray(meta.permissions)) {
        const { permissions, optional } = meta;

        if (!optional) {
            const hasAllPermissions = permissions.every((perm) =>
                typeof user.hasPermission === 'function' ? user.hasPermission(perm) : false,
            );
            if (!hasAllPermissions) {
                throw new WsException('Permisos insuficientes');
            }
        }

        const hasPermission = permissions.some((perm) =>
            typeof user.hasPermission === 'function' ? user.hasPermission(perm) : false,
        );
        if (!hasPermission) {
            throw new WsException('Permisos insuficientes');
        }
    }

    return user;
});
