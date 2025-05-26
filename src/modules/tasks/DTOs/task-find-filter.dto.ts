import { PaginationDto } from 'src/common/validators/pagination.dto';
import { TaskColumnOptions } from '../enums/TaskColumnOptions.enum';
import { SearchOperators } from 'src/common/enums/SearchOperators.enum';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, Validate, ValidateNested } from 'class-validator';
import { TaskSearchValueValidator } from './task-search-value-validator.dto';
import { Type } from 'class-transformer';

export class TaskPropertySearch {
    @IsNotEmpty({ message: 'El criterio de búsqueda es obligatorio' })
    @IsEnum(TaskColumnOptions, { message: 'Criterio de búsqueda no admitido' })
    key: TaskColumnOptions;

    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de búsqueda no admitido' })
    operator: SearchOperators;

    @Validate(TaskSearchValueValidator)
    value: number | string | Date;

    @IsOptional()
    @Validate(TaskSearchValueValidator)
    valueEnd?: number | string | Date;
}

export class TaskFindFilters {
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(TaskColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: TaskColumnOptions;

    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El tipo de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC';

    @IsNotEmpty({ message: 'La paginación es obligatoria' })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto;

    @IsOptional()
    @Type(() => TaskPropertySearch)
    @ValidateNested()
    query?: TaskPropertySearch;
}
