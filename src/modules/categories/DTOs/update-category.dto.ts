import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    @IsString({ message: 'El nombre de la categoría debe ser un texto válido' })
    @Length(1, 100, { message: 'El nombre de la categoría debe tener entre 1 y 100 caracteres' })
    readonly name?: string;
}
