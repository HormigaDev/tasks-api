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

export class CreateSubtaskDto {
    @ApiProperty({
        description: 'ID de la tarea principal',
        type: Number,
        example: 123,
    })
    @IsNotEmpty({ message: 'El id de la tarea es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El id de la tarea debe ser un número válido' },
    )
    taskId: number;

    @ApiProperty({
        description: 'Título de la subtarea',
        type: String,
        minLength: 3,
        maxLength: 100,
        example: 'Diseñar interfaz de usuario',
    })
    @IsNotEmpty({ message: 'El título de la subtarea es obligatorio' })
    @IsString({ message: 'El título de la subtarea debe ser un texto válido' })
    @Length(3, 100, { message: 'El título de la subtarea debe tener entre 3 y 100 caracteres' })
    readonly title: string;

    @ApiProperty({
        description: 'Descripción detallada de la subtarea',
        type: String,
        minLength: 1,
        example: 'Crear los mockups para la página principal',
    })
    @IsNotEmpty({ message: 'La descripción de la subtarea es obligatoria' })
    @IsString({ message: 'La descripción de la subtarea debe ser un texto válido' })
    @MinLength(1, { message: 'La descripción de la subtarea no puede estar vacía' })
    readonly description: string;

    @ApiProperty({
        description: 'Prioridad de la subtarea (ID numérico)',
        type: Number,
        example: 2,
    })
    @IsNotEmpty({ message: 'Por favor informe la prioridad de la subtarea' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la prioridad debe ser un número entero válido' },
    )
    readonly priority: number;

    @ApiPropertyOptional({
        description: 'Lista de IDs de etiquetas asociadas',
        type: [Number],
        example: [1, 5, 10],
    })
    @IsOptional()
    @IsArray({ message: 'Las etiquetas de la subtarea deben ser una lista de IDs numéricos' })
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'El ID de las etiquetas deben ser un número entero válido' },
    )
    readonly tags?: number[];

    @ApiPropertyOptional({
        description: 'Lista de IDs de archivos adjuntos',
        type: [Number],
        example: [100, 101],
    })
    @IsOptional()
    @IsArray({
        message: 'Los archivos adjuntos de la subtarea deben ser una lista de IDs numéricos',
    })
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'El ID de los archivos adjuntos deben ser un número entero válido' },
    )
    readonly attachments?: number[];
}
