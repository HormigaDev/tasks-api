import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common';
import { ContextService } from 'src/modules/context/context.service';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable({ scope: Scope.REQUEST })
export class ContextInterceptor implements NestInterceptor {
    constructor(
        private readonly contextService: ContextService,
        private readonly usersService: UsersService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return new Observable((observer) => {
            this.contextService.runWithContext(async () => {
                const request = context.switchToHttp().getRequest();

                if (request.user) {
                    const user = await this.usersService.findById(request.user.userId);
                    this.contextService.set('userEntity', user);
                }

                next.handle().subscribe({
                    next: (value) => observer.next(value),
                    error: (err) => observer.error(err),
                    complete: () => observer.complete(),
                });
            });
        });
    }
}
