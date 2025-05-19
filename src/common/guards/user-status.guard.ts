import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { UserStatus } from 'src/database/model/entities/user-status.entity';

@Injectable()
export class UserStatusGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId: number = request.user?.['userId'];
        if (!userId) {
            throw new UnauthorizedException('Usuario no informado.');
        }

        const user = await this.usersService.findById(userId);
        switch (user.status.id) {
            case UserStatus.Active:
                return true;
            case UserStatus.Inactive:
                throw new ForbiddenException('Usuario inactivo.');
            case UserStatus.Blocked:
                throw new ForbiddenException('Usuario bloqueado.');
            default:
                throw new ForbiddenException('Usuario no encontrado.');
        }
    }
}
