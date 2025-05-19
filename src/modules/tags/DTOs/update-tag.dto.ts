import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateTagDto {
    @IsOptional()
    @IsString({ message: 'El nombre de la etiqueta debe ser un texto válido' })
    @Length(1, 100, { message: 'El nombre de la etiqueta debe tener entre 1 y 100 caracteres' })
    readonly name?: string;

    @IsOptional()
    @IsString({ message: 'El color de la etiqueta debe ser un texto válido' })
    @Length(7, 7, { message: 'El color de la etiqueta debe tener exactamente 7 caracteres' })
    @Matches(/^#[0-9A-Fa-f]{6}$/, {
        message: 'El color de la etiqueta debe ser un código hexadecimal válido',
    })
    readonly color?: string;
}
