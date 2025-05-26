import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class UpdateTaskDto {
    @IsOptional()
    @IsString({ message: 'El título de la tarea debe ser un texto válido' })
    @Length(3, 100, { message: 'El título de la tarea debe tener entre 3 y 100 caracteres' })
    readonly title?: string;

    @IsOptional()
    @IsString({ message: 'La descripción de la tarea debe ser un texto válido' })
    @MinLength(1, { message: 'La descripción de la tarea no puede estar vacía' })
    readonly description?: string;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la prioridad debe ser un número entero válido' },
    )
    readonly priority?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El ID de la categoría debe ser un número entero válido' },
    )
    readonly category?: number;
}
