import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMilestoneDto {
    @ApiProperty({
        description: 'Título del hito',
        example: 'Lanzamiento de versión 1.0',
        minLength: 3,
        maxLength: 100,
        type: String,
    })
    @IsNotEmpty({ message: 'El título del hito es obligatorio' })
    @IsString({ message: 'El título del hito debe ser un texto válido' })
    @Length(3, 100, { message: 'El título del hito debe tener entre 3 y 100 caracteres' })
    readonly title: string;

    @ApiProperty({
        description: 'Descripción detallada del hito',
        example: 'Completar el desarrollo de todas las funcionalidades críticas.',
        type: String,
    })
    @IsNotEmpty({ message: 'La descripción del hito es obligatoria' })
    @IsString({ message: 'La descripción del hito debe ser un texto válido' })
    readonly description: string;

    @ApiPropertyOptional({
        description: 'Fecha prevista para cumplir el hito en formato yyyy-mm-dd',
        example: '2025-12-31',
        type: String,
        format: 'date',
    })
    @IsOptional()
    @IsDateString(
        {},
        { message: 'La fecha prevista del hito debe ser válida en formato yyyy-mm-dd' },
    )
    @Transform(({ value }) => new Date(value))
    readonly expectedDate?: Date;
}
