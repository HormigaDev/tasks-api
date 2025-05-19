import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common';
import { ContextService } from 'src/modules/context/context.service';
import { Observable } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export class ContextInterceptor implements NestInterceptor {
    constructor(private readonly contextService: ContextService) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return new Observable((observer) => {
            this.contextService.runWithContext(async () => {
                const request = context.switchToHttp().getRequest();

                if (request.user) {
                    this.contextService.set('user', request.user);
                    this.contextService.set('userId', request.user.userId);
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
