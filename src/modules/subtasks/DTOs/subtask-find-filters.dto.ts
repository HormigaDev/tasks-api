import { PaginationDto } from 'src/common/validators/pagination.dto';
import { SubtaskColumnOptions } from '../enums/SubtaskColumnOptions.enum';
import { SearchOperators } from 'src/common/enums/SearchOperators.enum';
import {
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Validate,
    ValidateNested,
} from 'class-validator';
import { SubtaskSearchValueValidator } from './subtask-search-value-validator.dto';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubtaskPropertySearch {
    @ApiProperty({
        description: 'Criterio de búsqueda (columna)',
        enum: SubtaskColumnOptions,
    })
    @IsNotEmpty({ message: 'El criterio de búsqueda es obligatorio' })
    @IsEnum(SubtaskColumnOptions, { message: 'Criterio de búsqueda no admitido' })
    key: SubtaskColumnOptions;

    @ApiProperty({
        description: 'Operador de búsqueda',
        enum: SearchOperators,
    })
    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de búsqueda no admitido' })
    operator: SearchOperators;

    @ApiProperty({
        description: 'Valor para búsqueda',
        oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'string', format: 'date-time' }],
    })
    @Validate(SubtaskSearchValueValidator)
    value: number | string | Date;

    @ApiPropertyOptional({
        description: 'Valor final para búsqueda en rangos',
        oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'string', format: 'date-time' }],
    })
    @IsOptional()
    @Validate(SubtaskSearchValueValidator)
    valueEnd?: number | string | Date;
}

export class SubtaskFindFilters {
    @ApiProperty({
        description: 'ID de la tarea padre',
        type: Number,
        example: 123,
    })
    @IsNotEmpty({ message: 'El id de la tarea es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El id de la tarea debe ser un número válido' },
    )
    taskId: number;

    @ApiProperty({
        description: 'Criterio para ordenar resultados',
        enum: SubtaskColumnOptions,
        default: SubtaskColumnOptions.Id,
    })
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(SubtaskColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: SubtaskColumnOptions = SubtaskColumnOptions.Id;

    @ApiProperty({
        description: 'Tipo de ordenación',
        enum: ['ASC', 'DESC'],
        default: 'DESC',
    })
    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El tipo de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({
        description: 'Paginación para resultados',
        type: PaginationDto,
    })
    @IsNotEmpty({ message: 'La paginación es obligatoria' })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto = new PaginationDto();

    @ApiPropertyOptional({
        description: 'Filtro de búsqueda avanzado',
        type: SubtaskPropertySearch,
    })
    @IsOptional()
    @Type(() => SubtaskPropertySearch)
    @ValidateNested()
    query?: SubtaskPropertySearch;
}
