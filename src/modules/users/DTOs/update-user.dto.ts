import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'El nombre de usuario debe ser un string válido.' })
    @Matches(/^[\p{L}0-9 _-]+$/u, {
        message: 'El nombre debe ser alfa numérico con posibilidad de espacios y guiones (-, _)',
    })
    readonly name?: string;

    @IsOptional()
    @IsString({ message: 'El correo electrónico debe ser un string válido' })
    @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
    readonly email?: string;

    @IsOptional()
    @IsArray({ message: 'Los roles del usuario deben ser un array válido.' })
    @ArrayNotEmpty({ message: 'El array de roles no puede estar vacío.' })
    @ArrayMinSize(1, { message: 'El array debe contener al menos el id de 1 rol' })
    @IsInt({ each: true, message: 'Cada elemento del array debe ser un número entero.' })
    roles?: number[];
}
