import { IsArray, IsNotEmpty, IsNumber, Min, MinLength } from 'class-validator';

export class UpdateUserRolesDto {
    @IsNotEmpty({ message: 'Los roles son obligatorios' })
    @IsArray({ message: 'Los roles deben ser un arreglo' })
    @IsNumber({}, { each: true, message: 'Los roles deben ser un arreglo de números' })
    @MinLength(1, { message: 'Los roles deben tener al menos un elemento' })
    @Min(1, { each: true, message: 'Los roles deben ser mayores a 0' })
    roles: number[];
}
