import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    @IsString({ message: 'El nombre de la categoría debe ser un texto válido' })
    @Length(1, 100, { message: 'El nombre de la categoría debe tener entre 1 y 100 caracteres' })
    readonly name?: string;

    @IsOptional()
    @IsString({ message: 'El icono de la categoría debe ser un texto válido' })
    @Length(1, 50, { message: 'El icono de la categoría debe tener entre 1 y 50 caracteres' })
    readonly icon?: string;

    @IsOptional()
    @IsString({ message: 'El color de la categoría debe ser un texto válido' })
    @Length(7, 7, { message: 'El color de la categoría debe tener 7 caracteres' })
    readonly color?: string;
}
