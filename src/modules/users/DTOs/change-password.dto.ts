import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Contraseña anterior del usuario',
        type: String,
        example: 'OldPass123!',
    })
    @IsNotEmpty({ message: 'La contraseña anterior es obligatoria.' })
    @IsString({ message: 'La contraseña anterior debe ser un string válido.' })
    readonly previousPassword: string;

    @ApiProperty({
        description:
            'Nueva contraseña, con mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo',
        type: String,
        example: 'NewPass123!',
    })
    @IsNotEmpty({ message: 'La nueva contraseña es obligatoria.' })
    @IsString({ message: 'La nueva contraseña debe ser un string válido.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%^&*()_+={}\[\]:;"'<>?,./|\\~-]).{8,}$/, {
        message:
            'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.',
    })
    readonly newPassword: string;
}
