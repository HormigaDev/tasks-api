import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubtaskDto {
    @ApiPropertyOptional({
        description: 'Título de la subtarea',
        minLength: 3,
        maxLength: 100,
        example: 'Revisar documentación',
    })
    @IsOptional()
    @IsString({ message: 'El título de la subtarea debe ser un texto válido' })
    @Length(3, 100, { message: 'El título de la subtarea debe tener entre 3 y 100 caracteres' })
    readonly title?: string;

    @ApiPropertyOptional({
        description: 'Descripción de la subtarea',
        minLength: 1,
        example: 'Actualizar y revisar la documentación técnica del proyecto',
    })
    @IsOptional()
    @IsString({ message: 'La descripción de la subtarea debe ser un texto válido' })
    @MinLength(1, { message: 'La descripción de la subtarea no puede estar vacía' })
    readonly description?: string;

    @ApiPropertyOptional({
        description: 'ID de la prioridad',
        type: Number,
        example: 2,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la prioridad debe ser un número entero válido' },
    )
    readonly priority?: number;
}
