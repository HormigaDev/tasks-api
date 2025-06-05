import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        type: String,
        example: 'usuario@ejemplo.com',
    })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsString({ message: 'El correo electrónico debe ser un string válido.' })
    readonly email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        type: String,
        example: 'Password123!',
    })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString({ message: 'La contraseña debe ser un string válido.' })
    readonly password: string;
}
