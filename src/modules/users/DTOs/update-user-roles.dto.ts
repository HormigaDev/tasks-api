import { IsArray, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRolesDto {
    @ApiProperty({
        description: 'Array con los IDs numéricos de roles a actualizar',
        example: [1, 2, 3],
        type: [Number],
        minItems: 1,
    })
    @IsNotEmpty({ message: 'Los roles son obligatorios' })
    @IsArray({ message: 'Los roles deben ser un arreglo' })
    @IsNumber({}, { each: true, message: 'Los roles deben ser un arreglo de números' })
    @Min(1, { each: true, message: 'Los roles deben ser mayores a 0' })
    roles: number[];
}
