import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsString({ message: 'El correo electrónico debe ser un string válido.' })
    readonly email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString({ message: 'La contraseña debe ser un string válido.' })
    readonly password: string;
}
