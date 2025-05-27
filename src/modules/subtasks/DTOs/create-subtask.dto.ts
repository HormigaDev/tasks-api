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

export class CreateSubtaskDto {
    @IsNotEmpty({ message: 'El id de la tarea es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El id de la tarea debe ser un número válido' },
    )
    taskId: number;

    @IsNotEmpty({ message: 'El título de la subtarea es obligatorio' })
    @IsString({ message: 'El título de la subtarea debe ser un texto válido' })
    @Length(3, 100, { message: 'El título de la subtarea debe tener entre 3 y 100 caracteres' })
    readonly title: string;

    @IsNotEmpty({ message: 'La descripción de la subtarea es obligatoria' })
    @IsString({ message: 'La descripción de la subtarea debe ser un texto válido' })
    @MinLength(1, { message: 'La descripción de la subtarea no puede estar vacía' })
    readonly description: string;

    @IsNotEmpty({ message: 'Por favor informe la prioridad de la subtarea' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la prioridad debe ser un número entero válido' },
    )
    readonly priority: number;

    @IsOptional()
    @IsArray({ message: 'Las etiquetas de la subtarea deben ser una lista de IDs numéricos' })
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'El ID de las etiquetas deben ser un número entero válido' },
    )
    readonly tags?: number[];

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
