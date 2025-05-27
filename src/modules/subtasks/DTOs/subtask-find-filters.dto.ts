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

export class SubtaskPropertySearch {
    @IsNotEmpty({ message: 'El criterio de búsqueda es obligatorio' })
    @IsEnum(SubtaskColumnOptions, { message: 'Criterio de búsqueda no admitido' })
    key: SubtaskColumnOptions;

    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de búsqueda no admitido' })
    operator: SearchOperators;

    @Validate(SubtaskSearchValueValidator)
    value: number | string | Date;

    @IsOptional()
    @Validate(SubtaskSearchValueValidator)
    valueEnd?: number | string | Date;
}

export class SubtaskFindFilters {
    @IsNotEmpty({ message: 'El id de la tarea es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber(
        { allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'El id de la tarea debe ser un número válido' },
    )
    taskId: number;

    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(SubtaskColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: SubtaskColumnOptions;

    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El tipo de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC';

    @IsNotEmpty({ message: 'La paginación es obligatoria' })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto;

    @IsOptional()
    @Type(() => SubtaskPropertySearch)
    @ValidateNested()
    query?: SubtaskPropertySearch;
}
