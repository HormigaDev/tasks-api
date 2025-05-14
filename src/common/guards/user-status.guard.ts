import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';
import { UserStatus } from '../enums/UserStatus.enum';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class UserStatusGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId: number = request.user?.['userId'];
        if (!userId) {
            throw new UnauthorizedException('Usuario no informado.');
        }

        const user = await this.usersService.findOne(userId);
        switch (user.status) {
            case UserStatus.Active:
                return true;
            case UserStatus.Inactive:
                throw new ForbiddenException('Usuario inactivo.');
            case UserStatus.Blocked:
                throw new ForbiddenException('Usuario bloqueado.');
            case UserStatus.Deleted:
                throw new ForbiddenException('Usuario no encontrado.');
            default:
                throw new InternalServerErrorException('Estado de usuario desconocido.');
        }
    }
}
