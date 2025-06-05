import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
    @ApiPropertyOptional({
        description: 'Título de la tarea',
        minLength: 3,
        maxLength: 100,
        example: 'Implementar módulo de pagos',
    })
    @IsOptional()
    @IsString({ message: 'El título de la tarea debe ser un texto válido' })
    @Length(3, 100, {
        message: 'El título de la tarea debe tener entre 3 y 100 caracteres',
    })
    readonly title?: string;

    @ApiPropertyOptional({
        description: 'Descripción de la tarea',
        minLength: 1,
        example: 'Esta tarea corresponde a la integración del sistema de pagos.',
    })
    @IsOptional()
    @IsString({ message: 'La descripción de la tarea debe ser un texto válido' })
    @MinLength(1, { message: 'La descripción de la tarea no puede estar vacía' })
    readonly description?: string;

    @ApiPropertyOptional({
        description: 'ID de la prioridad',
        example: 2,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la prioridad debe ser un número entero válido' },
    )
    readonly priority?: number;

    @ApiPropertyOptional({
        description: 'ID de la categoría',
        example: 5,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la categoría debe ser un número entero válido' },
    )
    readonly category?: number;

    @ApiPropertyOptional({
        description: 'ID del hito asociado',
        example: 10,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID del hito debe ser un número entero válido' },
    )
    milestone?: number;
}
