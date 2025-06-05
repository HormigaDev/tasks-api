import { Transform } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({
        description: 'Título de la tarea',
        type: String,
        minLength: 3,
        maxLength: 100,
        example: 'Implementar sistema de autenticación',
    })
    @IsNotEmpty({ message: 'El título de la tarea es obligatorio' })
    @IsString({ message: 'El título de la tarea debe ser un texto válido' })
    @Length(3, 100, { message: 'El título de la tarea debe tener entre 3 y 100 caracteres' })
    readonly title: string;

    @ApiProperty({
        description: 'Descripción de la tarea',
        type: String,
        minLength: 1,
        example: 'Desarrollar la lógica para login y registro de usuarios.',
    })
    @IsNotEmpty({ message: 'La descripción de la tarea es obligatoria' })
    @IsString({ message: 'La descripción de la tarea debe ser un texto válido' })
    @MinLength(1, { message: 'La descripción de la tarea no puede estar vacía' })
    readonly description: string;

    @ApiProperty({
        description: 'ID numérico de la prioridad',
        type: Number,
        example: 2,
    })
    @IsNotEmpty({ message: 'Por favor informe la prioridad de la tarea' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la prioridad debe ser un número entero válido' },
    )
    readonly priority: number;

    @ApiProperty({
        description: 'ID numérico de la categoría',
        type: Number,
        example: 5,
    })
    @IsNotEmpty({ message: 'Por favor informe la categoría de la tarea' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la categoría debe ser un número entero válido' },
    )
    readonly category: number;

    @ApiPropertyOptional({
        description: 'ID numérico del hito relacionado',
        type: Number,
        example: 12,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID del hito debe ser un número válido' },
    )
    milestone?: number;

    @ApiPropertyOptional({
        description: 'Lista de IDs numéricos de etiquetas',
        type: [Number],
        example: [1, 3, 5],
    })
    @IsOptional()
    @IsArray({ message: 'Las etiquetas de la tarea deben ser una lista de IDs numéricos' })
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'El ID de las etiquetas deben ser un número entero válido' },
    )
    readonly tags?: number[];

    @ApiPropertyOptional({
        description: 'Lista de IDs numéricos de archivos adjuntos',
        type: [Number],
        example: [10, 12],
    })
    @IsOptional()
    @IsArray({ message: 'Los archivos adjuntos de la tarea deben ser una lista de IDs numéricos' })
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'El ID de los archivos adjuntos deben ser un número entero válido' },
    )
    readonly attachments?: number[];
}
