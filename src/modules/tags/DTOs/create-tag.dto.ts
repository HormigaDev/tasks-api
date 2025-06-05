import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
    @ApiProperty({
        description: 'Nombre de la etiqueta',
        minLength: 1,
        maxLength: 100,
        example: 'Urgente',
    })
    @IsNotEmpty({ message: 'El nombre de la etiqueta es obligatorio' })
    @IsString({ message: 'El nombre de la etiqueta debe ser un texto válido' })
    @Length(1, 100, { message: 'El nombre de la etiqueta debe tener entre 1 y 100 caracteres' })
    readonly name: string;

    @ApiPropertyOptional({
        description: 'Color de la etiqueta en formato hexadecimal',
        example: '#FF5733',
        pattern: '^#[0-9A-Fa-f]{6}$',
        minLength: 7,
        maxLength: 7,
    })
    @IsOptional()
    @IsString({ message: 'El color de la etiqueta debe ser un texto válido' })
    @Length(7, 7, { message: 'El color de la etiqueta debe tener exactamente 7 caracteres' })
    @Matches(/^#[0-9A-Fa-f]{6}$/, {
        message: 'El color de la etiqueta debe ser un código hexadecimal válido',
    })
    readonly color: string;
}
