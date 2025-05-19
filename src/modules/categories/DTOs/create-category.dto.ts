import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
    @IsString({ message: 'El nombre de la categoría debe ser un texto válido' })
    @Length(1, 100, { message: 'El nombre de la categoría debe tener entre 1 y 100 caracteres' })
    readonly name: string;
}
