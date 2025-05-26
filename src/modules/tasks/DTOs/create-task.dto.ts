import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { CreateMilestoneDto } from 'src/modules/milestones/DTOs/create-milestone.dto';

export class CreateTaskDto {
    @IsNotEmpty({ message: 'El título de la tarea es obligatorio' })
    @IsString({ message: 'El título de la tarea debe ser un texto válido' })
    @Length(3, 100, { message: 'El título de la tarea debe tener entre 3 y 100 caracteres' })
    readonly title: string;

    @IsNotEmpty({ message: 'La descripción de la tarea es obligatoria' })
    @IsString({ message: 'La descripción de la tarea debe ser un texto válido' })
    @MinLength(1, { message: 'La descripción de la tarea no puede estar vacía' })
    readonly description: string;

    @IsNotEmpty({ message: 'Por favor informe la prioridad de la tarea' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la prioridad debe ser un número entero válido' },
    )
    readonly priority: number;

    @IsNotEmpty({ message: 'Por favor informe la categoría de la tarea' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la categoría debe ser un número entero válido' },
    )
    readonly category: number;

    @IsOptional()
    @IsArray({ message: 'Las etiquetas de la tarea deben ser una lista de IDs numéricos' })
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'El ID de las etiquetas deben ser un número entero válido' },
    )
    readonly tags?: number[];

    @IsOptional()
    @Type(() => CreateMilestoneDto)
    @ValidateNested({ each: true })
    readonly milestones?: CreateMilestoneDto[];

    @IsOptional()
    @IsArray({ message: 'Los archivos adjuntos de la tarea deben ser una lista de IDs numéricos' })
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'El ID de los archivos adjuntos deben ser un número entero válido' },
    )
    readonly attachments?: number[];
}
