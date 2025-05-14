import { IsOptional, IsString, IsNumber, Length } from 'class-validator';

export class UpdateRoleDto {
    @IsOptional()
    @IsString({ message: 'El nombre del rol debe ser un string válido.' })
    @Length(3, 100, { message: 'El nombre del rol debe tener entre 3 y 100 caracteres.' })
    readonly name?: string;

    @IsOptional()
    @IsNumber(
        { maxDecimalPlaces: 0 },
        { message: 'Los permisos deben ser un numero entero válido.' },
    )
    readonly permissions?: number;
}
