import {
    IsNotEmpty,
    IsString,
    IsEmail,
    Matches,
    IsArray,
    ArrayNotEmpty,
    ArrayMinSize,
    IsInt,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
    @IsString({ message: 'El nombre de usuario debe ser un string válido.' })
    readonly name: string;

    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
    readonly email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString({ message: 'La contraseña debe ser un string válido.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%^&*()_+={}\[\]:;"'<>?,./|\\~-]).{8,}$/, {
        message:
            'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.',
    })
    readonly password: string;

    @IsNotEmpty({ message: 'Los roles del usuario son obligatorios.' })
    @IsArray({ message: 'Los roles del usuario deben ser un array válido.' })
    @ArrayNotEmpty({ message: 'El array de roles no puede estar vacío.' })
    @ArrayMinSize(1, { message: 'El array debe contener al menos el id de 1 rol' })
    @IsInt({ each: true, message: 'Cada elemento del array debe ser un número entero.' })
    readonly roles: number[];
}
