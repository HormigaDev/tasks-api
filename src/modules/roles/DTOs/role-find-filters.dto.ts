import { SearchOperators } from 'src/common/enums/SearchOperators.enum';
import { PaginationDto } from 'src/common/validators/pagination.dto';
import { RolesColumnOptions } from '../enums/RolesColumnOptions.enum';
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
import { RolesSearchValueValidator } from './role-search-value-validator.dto';

export class RoleFindQueryDto {
    @IsNotEmpty({ message: 'La clave de búsqueda es obligatoria' })
    @IsEnum(RolesColumnOptions, { message: 'Clave de búsqueda no admitida' })
    key: RolesColumnOptions;

    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de búsqueda no admitido' })
    operator: SearchOperators;

    @IsNotEmpty({ message: 'El valor de búsqueda es obligatorio' })
    @Validate(RolesSearchValueValidator)
    value: string | number;

    @IsOptional()
    @Validate(RolesSearchValueValidator)
    valueEnd?: string | number;
}

export class RoleFindFilters {
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(RolesColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: RolesColumnOptions;

    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsString({ message: 'El tipo de ordenación debe ser un texto válido' })
    @IsIn(['ASC', 'DESC'], {
        message: 'El tipo de ordenación solo puede ser "ASC" o "DESC" (sensible a mayúsculas)',
    })
    order: 'ASC' | 'DESC';

    @IsNotEmpty({ message: 'La paginación es obligatoria' })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto;

    @IsOptional()
    @Type(() => RoleFindQueryDto)
    @ValidateNested()
    query?: RoleFindQueryDto;
}
