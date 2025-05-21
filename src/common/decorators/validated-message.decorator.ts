import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { WsException } from '@nestjs/websockets';

export function ValidatedMessage(dtoClass: any) {
    return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
        const wsContext = ctx.switchToWs();
        const payload = wsContext.getData();

        const object = plainToInstance(dtoClass, payload);
        const errors = validateSync(object);

        if (errors.length > 0) {
            const messages = errors
                .map((err) => Object.values(err.constraints || {}).join(', '))
                .join('; ');
            throw new WsException(`Falló de validación: ${messages}`);
        }
        return object;
    })();
}
