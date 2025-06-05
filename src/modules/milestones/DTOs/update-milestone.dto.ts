import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMilestoneDto {
    @ApiPropertyOptional({
        description: 'Título del hito',
        type: String,
        minLength: 3,
        maxLength: 100,
        example: 'Lanzamiento versión 1.0',
    })
    @IsOptional()
    @IsString({ message: 'El título del hito debe ser un texto válido' })
    @Length(3, 100, { message: 'El título del hito debe tener entre 3 y 100 caracteres' })
    readonly title?: string;

    @ApiPropertyOptional({
        description: 'Descripción del hito',
        type: String,
        example: 'Descripción detallada del hito',
    })
    @IsOptional()
    @IsString({ message: 'La descripción del hito debe ser un texto válido' })
    readonly description?: string;

    @ApiPropertyOptional({
        description: 'Fecha prevista del hito en formato ISO 8601 (yyyy-mm-dd)',
        type: String,
        format: 'date',
        example: '2025-12-31',
    })
    @IsOptional()
    @IsDateString(
        {},
        { message: 'La fecha prevista del hito debe ser válida en formato yyyy-mm-dd' },
    )
    @Transform(({ value }) => new Date(value))
    readonly expectedDate?: Date;
}
