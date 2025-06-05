import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { IsNotNaN } from './is-not-nan.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
    @ApiPropertyOptional({
        description: 'Límite de registros por página',
        example: 100,
        enum: [10, 20, 30, 50, 100],
        default: 100,
    })
    @IsNotEmpty({ message: 'El límite de registros por página es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El límite de registros por página debe ser un número válido' })
    @IsNotNaN({ message: 'El límite de registros por página debe ser un número válido' })
    @IsIn([10, 20, 30, 50, 100], {
        message:
            'El límite de registros por página debe ser uno de los siguientes valores: 10, 20, 30, 50 o 100',
    })
    limit: number = 100;

    @ApiPropertyOptional({
        description: 'Número de página',
        example: 1,
        minimum: 1,
        default: 1,
    })
    @IsNotEmpty({ message: 'La página es obligatoria' })
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'La página debe ser un número válido' })
    @IsNotNaN({ message: 'La página debe ser un número válido' })
    @Min(1, { message: 'La página debe ser mayor que 0' })
    page: number = 1;
}
