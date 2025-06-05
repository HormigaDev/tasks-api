import { IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
    @ApiPropertyOptional({
        description: 'Nombre de la categoría',
        example: 'Tecnología',
        minLength: 1,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: 'El nombre de la categoría debe ser un texto válido' })
    @Length(1, 100, { message: 'El nombre de la categoría debe tener entre 1 y 100 caracteres' })
    readonly name?: string;

    @ApiPropertyOptional({
        description: 'Icono que representa la categoría',
        example: 'fas fa-laptop',
        minLength: 1,
        maxLength: 50,
    })
    @IsOptional()
    @IsString({ message: 'El icono de la categoría debe ser un texto válido' })
    @Length(1, 50, { message: 'El icono de la categoría debe tener entre 1 y 50 caracteres' })
    readonly icon?: string;

    @ApiPropertyOptional({
        description: 'Color en formato hexadecimal de la categoría',
        example: '#FF5733',
        minLength: 7,
        maxLength: 7,
    })
    @IsOptional()
    @IsString({ message: 'El color de la categoría debe ser un texto válido' })
    @Length(7, 7, { message: 'El color de la categoría debe tener 7 caracteres' })
    readonly color?: string;
}
