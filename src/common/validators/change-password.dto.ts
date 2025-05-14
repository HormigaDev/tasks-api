import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty({ message: 'La contraseña anterior es obligatoria.' })
    @IsString({ message: 'La contraseña anterior debe ser un string válido.' })
    readonly previusPassword: string;

    @IsNotEmpty({ message: 'La nueva contraseña es obligatoria.' })
    @IsString({ message: 'La nueva contraseña debe ser un string válido.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%^&*()_+={}\[\]:;"'<>?,./|\\~-]).{8,}$/, {
        message:
            'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.',
    })
    readonly newPassword: string;
}
