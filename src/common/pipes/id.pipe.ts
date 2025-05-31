import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class IdPipe implements PipeTransform {
    transform(value: any) {
        const id = parseInt(value, 10);

        if (isNaN(id) || id <= 0) {
            throw new BadRequestException(
                `ID inválido: "${value}". El ID debe ser un número válido`,
            );
        }

        return id;
    }
}
