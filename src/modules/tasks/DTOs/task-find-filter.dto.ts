import { PaginationDto } from 'src/common/validators/pagination.dto';
import { TaskColumnOptions } from '../enums/TaskColumnOptions.enum';
import { SearchOperators } from 'src/common/enums/SearchOperators.enum';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, Validate, ValidateNested } from 'class-validator';
import { TaskSearchValueValidator } from './task-search-value-validator.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskPropertySearch {
    @ApiProperty({
        description: 'Criterio para la búsqueda',
        enum: TaskColumnOptions,
        example: TaskColumnOptions.Title,
    })
    @IsNotEmpty({ message: 'El criterio de búsqueda es obligatorio' })
    @IsEnum(TaskColumnOptions, { message: 'Criterio de búsqueda no admitido' })
    key: TaskColumnOptions;

    @ApiProperty({
        description: 'Operador de búsqueda',
        enum: SearchOperators,
        example: SearchOperators.Equal,
    })
    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de búsqueda no admitido' })
    operator: SearchOperators;

    @ApiProperty({
        description: 'Valor para el criterio de búsqueda',
        example: 'Implementar login',
    })
    @Validate(TaskSearchValueValidator)
    value: number | string | Date;

    @ApiPropertyOptional({
        description: 'Valor final para rangos de búsqueda',
        example: '2025-06-30',
    })
    @IsOptional()
    @Validate(TaskSearchValueValidator)
    valueEnd?: number | string | Date;
}

export class TaskFindFilters {
    @ApiProperty({
        description: 'Criterio para ordenar los resultados',
        enum: TaskColumnOptions,
        example: TaskColumnOptions.Id,
        default: TaskColumnOptions.Id,
    })
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(TaskColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: TaskColumnOptions = TaskColumnOptions.Id;

    @ApiProperty({
        description: 'Dirección del ordenamiento',
        enum: ['ASC', 'DESC'],
        example: 'DESC',
        default: 'DESC',
    })
    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El tipo de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({
        description: 'Configuración de paginación',
        type: PaginationDto,
    })
    @IsNotEmpty({ message: 'La paginación es obligatoria' })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto = new PaginationDto();

    @ApiPropertyOptional({
        description: 'Filtros de búsqueda avanzados',
        type: TaskPropertySearch,
    })
    @IsOptional()
    @Type(() => TaskPropertySearch)
    @ValidateNested()
    query?: TaskPropertySearch;
}
