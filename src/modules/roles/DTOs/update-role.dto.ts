import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, Validate } from 'class-validator';
import { IsBigInt } from 'src/common/validators/is-big-int.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleDto {
    @ApiPropertyOptional({
        description: 'Nombre del rol',
        type: String,
        minLength: 3,
        maxLength: 100,
        example: 'Editor',
    })
    @IsOptional()
    @IsString({ message: 'El nombre del rol debe ser un string válido.' })
    @Length(3, 100, { message: 'El nombre del rol debe tener entre 3 y 100 caracteres.' })
    readonly name?: string;

    @ApiPropertyOptional({
        description: 'Permisos asociados al rol, representados como bigint',
        type: 'string', // documentamos bigint como string para Swagger
        example: '9007199254740991',
    })
    @IsOptional()
    @Transform(({ value }) => BigInt(value))
    @Validate(IsBigInt)
    readonly permissions?: bigint;
}
