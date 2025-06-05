import { PaginationDto } from 'src/common/validators/pagination.dto';
import { MilestoneColumnOptions } from '../enums/MilestoneColumnOptions.enum';
import { SearchOperators } from 'src/common/enums/SearchOperators.enum';
import {
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MilestoneSearchValueValidator } from './milestones-search-value-validator.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MilestonePropertySearch {
    @ApiProperty({
        description: 'Criterio o columna para realizar la búsqueda',
        enum: MilestoneColumnOptions,
        example: MilestoneColumnOptions.Title,
    })
    @IsNotEmpty({ message: 'El criterio de búsqueda es obligatorio' })
    @IsEnum(MilestoneColumnOptions, { message: 'Criterio de búsqueda no admitido' })
    key: MilestoneColumnOptions;

    @ApiProperty({
        description: 'Operador para la búsqueda',
        enum: SearchOperators,
        example: SearchOperators.Equal,
    })
    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de búsqueda no admitido' })
    operator: SearchOperators;

    @ApiProperty({
        description: 'Valor para buscar, puede ser string, número o fecha',
        oneOf: [{ type: 'string', format: 'date-time' }, { type: 'string' }, { type: 'number' }],
    })
    @Validate(MilestoneSearchValueValidator)
    value: string | number | Date;

    @ApiPropertyOptional({
        description: 'Valor final para búsquedas entre rangos',
        oneOf: [{ type: 'string', format: 'date-time' }, { type: 'string' }, { type: 'number' }],
    })
    @IsOptional()
    @Validate(MilestoneSearchValueValidator)
    valueEnd?: string | number | Date;
}

export class MilestoneFindFilters {
    @ApiProperty({
        description: 'Columna por la cual se ordenarán los resultados',
        enum: MilestoneColumnOptions,
        example: MilestoneColumnOptions.Id,
        default: MilestoneColumnOptions.Id,
    })
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(MilestoneColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: MilestoneColumnOptions = MilestoneColumnOptions.Id;

    @ApiProperty({
        description: 'Tipo de ordenación: ascendente o descendente',
        enum: ['ASC', 'DESC'],
        example: 'DESC',
        default: 'DESC',
    })
    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsString({ message: 'El tipo de ordenación debe ser un texto válido' })
    @IsIn(['ASC', 'DESC'], { message: 'El tipo de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({
        description: 'Paginación para los resultados',
        type: PaginationDto,
    })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto = new PaginationDto();

    @ApiPropertyOptional({
        description: 'Criterio de búsqueda adicional',
        type: MilestonePropertySearch,
    })
    @IsOptional()
    @Type(() => MilestonePropertySearch)
    @ValidateNested()
    query?: MilestonePropertySearch;
}
