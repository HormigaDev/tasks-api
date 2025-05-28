import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { logErrorToFile } from 'src/logger/error-logger';
import { WebSocket } from 'ws';

@Catch() // No especificar excepción => captura TODO
export class WsAllExceptionsFilter implements ExceptionFilter {
    constructor() {}

    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToWs();
        const client = ctx.getClient<WebSocket>();
        const data = ctx.getData();

        const errorMessage =
            exception instanceof WsException
                ? exception.getError()
                : exception instanceof Error
                  ? exception.message
                  : String(exception);

        const errorResponse = {
            event: 'error',
            data: {
                message: errorMessage,
                timestamp: new Date().toISOString(),
                payload: data,
            },
        };

        // Envía el error al cliente WebSocket
        try {
            client.send(JSON.stringify(errorResponse));
        } catch (sendError) {
            logErrorToFile(sendError);
        }

        logErrorToFile(exception as Error);
    }
}
