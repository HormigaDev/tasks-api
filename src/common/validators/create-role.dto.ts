import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, Length, Validate } from 'class-validator';
import { IsBigInt } from './is-big-int.dto';

export class CreateRoleDto {
    @IsNotEmpty({ message: 'El nombre del rol es obligatorio.' })
    @IsString({ message: 'El nombre del rol debe ser un string válido.' })
    @Length(3, 100, { message: 'El nombre del rol debe tener entre 3 y 100 caracteres.' })
    readonly name: string;

    @IsNotEmpty({ message: 'Los permisos son obligatorios.' })
    @Transform(({ value }) => BigInt(value))
    @Validate(IsBigInt)
    readonly permissions: bigint;
}
