import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { IsBigInt } from 'src/common/validators/is-big-int.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({
        description: 'Nombre del rol',
        type: String,
        minLength: 3,
        maxLength: 100,
        example: 'Administrador',
    })
    @IsNotEmpty({ message: 'El nombre del rol es obligatorio.' })
    @IsString({ message: 'El nombre del rol debe ser un string válido.' })
    @Length(3, 100, { message: 'El nombre del rol debe tener entre 3 y 100 caracteres.' })
    readonly name: string;

    @ApiProperty({
        description: 'Permisos asociados al rol, representados como bigint',
        type: 'string', // Swagger no soporta bigint, se documenta como string
        example: '9007199254740991',
    })
    @IsNotEmpty({ message: 'Los permisos son obligatorios.' })
    @Transform(({ value }) => BigInt(value))
    @Validate(IsBigInt)
    readonly permissions: bigint;
}
