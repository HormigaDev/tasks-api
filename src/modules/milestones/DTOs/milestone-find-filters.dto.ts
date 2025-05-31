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

export class MilestonePropertySearch {
    @IsNotEmpty({ message: 'El criterio de búsqueda es obligatorio' })
    @IsEnum(MilestoneColumnOptions, { message: 'Criterio de búsqueda no admitido' })
    key: MilestoneColumnOptions;

    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de búsqueda no admitido' })
    operator: SearchOperators;

    @Validate(MilestoneSearchValueValidator)
    value: string | number | Date;

    @IsOptional()
    @Validate(MilestoneSearchValueValidator)
    valueEnd?: string | number | Date;
}

export class MilestoneFindFilters {
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(MilestoneColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: MilestoneColumnOptions = MilestoneColumnOptions.Id;

    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsString({ message: 'El tipo de ordenación debe ser un texto válido' })
    @IsIn(['ASC', 'DESC'], { message: 'El tipo de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC' = 'DESC';

    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto = new PaginationDto();

    @IsOptional()
    @Type(() => MilestonePropertySearch)
    @ValidateNested()
    query?: MilestonePropertySearch;
}
