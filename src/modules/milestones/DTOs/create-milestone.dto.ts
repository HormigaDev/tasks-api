import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateMilestoneDto {
    @IsNotEmpty({ message: 'El título del hito es obligatorio' })
    @IsString({ message: 'El título del hito debe ser un texto válido' })
    @Length(3, 100, { message: 'El título del hito debe tener entre 3 y 100 caracteres' })
    readonly title: string;

    @IsNotEmpty({ message: 'La descripción del hito es obligatoria' })
    @IsString({ message: 'La descripción del hito debe ser un texto válido' })
    readonly description: string;

    @IsOptional()
    @IsDateString(
        {},
        { message: 'La fecha prevista del hito debe ser válida en formato yyyy-mm-dd' },
    )
    @Transform(({ value }) => new Date(value))
    readonly expectedDate?: Date;
}
