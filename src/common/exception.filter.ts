import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { CustomError } from './types/CustomError.type';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor() {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (!(exception instanceof HttpException)) {
            if (exception instanceof CustomError) {
                this.log(exception);
            } else {
                console.log(exception);
            }
        }

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Ocurrió un error inesperado. Inténtelo de nuevo más tarde';

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }

    log(error: any) {
        const logDir = process.env.LOG_DIR;
        if (!logDir) {
            console.log(error);
        } else {
            if (!existsSync(logDir)) {
                mkdirSync(logDir, { recursive: true });
            }
            const name = Date.now() + '';
            try {
                writeFileSync(join(logDir, name), JSON.stringify(error));
            } catch (err) {
                console.log(err, error);
            }
        }
    }
}
