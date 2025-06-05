import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Nombre de la categoría',
        example: 'Tecnología',
        minLength: 1,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
    @IsString({ message: 'El nombre de la categoría debe ser un texto válido' })
    @Length(1, 100, { message: 'El nombre de la categoría debe tener entre 1 y 100 caracteres' })
    readonly name: string;

    @ApiProperty({
        description: 'Icono que representa la categoría',
        example: 'fas fa-laptop',
        minLength: 1,
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'El icono de la categoría es obligatorio' })
    @IsString({ message: 'El icono de la categoría debe ser un texto válido' })
    @Length(1, 50, { message: 'El icono de la categoría debe tener entre 1 y 50 caracteres' })
    readonly icon: string;

    @ApiProperty({
        description: 'Color en formato hexadecimal de la categoría',
        example: '#FF5733',
        minLength: 7,
        maxLength: 7,
    })
    @IsNotEmpty({ message: 'El color de la categoría es obligatorio' })
    @IsString({ message: 'El color de la categoría debe ser un texto válido' })
    @Length(7, 7, { message: 'El color de la categoría debe tener 7 caracteres' })
    readonly color: string;
}
