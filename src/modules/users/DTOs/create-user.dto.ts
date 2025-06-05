import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsEmail,
    Matches,
    IsArray,
    ArrayNotEmpty,
    ArrayMinSize,
    IsInt,
    Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Pérez',
        minLength: 2,
        maxLength: 255,
        pattern: '^[\\p{L}0-9 _-]+$',
    })
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
    @IsString({ message: 'El nombre de usuario debe ser un string válido.' })
    @Length(2, 255, { message: 'El nombre debe tener entre 2 y 255 caracteres' })
    @Matches(/^[\p{L}0-9 _-]+$/u, {
        message: 'El nombre debe ser alfa numérico con posibilidad de espacios y guiones (-, _)',
    })
    readonly name: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@dominio.com',
        format: 'email',
    })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
    readonly email: string;

    @ApiProperty({
        description:
            'Contraseña que debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo',
        minLength: 8,
        pattern:
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@\\$%\\^&\\*()_+=\\{\\}\\[\\]:;\\"\'<>?,./|\\\\~\\-]).{8,}$',
    })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString({ message: 'La contraseña debe ser un string válido.' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\!\@\$\%\^\&\*\(\)\_\+\=\{\}\[\]\:\;\"\'\<\>\?\,\.\/\|\\\~\-]).{8,}$/,
        {
            message:
                'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.',
        },
    )
    readonly password: string;

    @ApiProperty({
        description: 'Array con los IDs numéricos de roles asignados al usuario',
        example: [1],
        type: [Number],
    })
    @IsNotEmpty({ message: 'Los roles del usuario son obligatorios.' })
    @IsArray({ message: 'Los roles del usuario deben ser un array válido.' })
    @ArrayNotEmpty({ message: 'El array de roles no puede estar vacío.' })
    @ArrayMinSize(1, { message: 'El array debe contener al menos el id de 1 rol' })
    @Transform(({ value }) => JSON.parse(value ?? '[]'))
    @IsInt({ each: true, message: 'Cada elemento del array debe ser un número entero.' })
    readonly roles: number[];
}
