import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
    constructor(message: string = 'Too Many Requests') {
        super(
            {
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message,
                error: 'Too Many Requests',
            },
            HttpStatus.TOO_MANY_REQUESTS,
        );
    }
}
