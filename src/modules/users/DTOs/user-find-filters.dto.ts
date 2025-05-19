import { SearchOperators } from 'src/common/enums/SearchOperators.enum';
import { UserColumnOptions } from '../enums/UserColumnOptions.enum';
import {
    IsBoolean,
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsOptional,
    Validate,
    ValidateNested,
} from 'class-validator';
import { UserSearchValueValidator } from './user-search-value-validator.dto';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from 'src/common/validators/pagination.dto';

export class UserPropertySearch {
    @IsNotEmpty({ message: 'El criterio de búsqueda es obligatorio' })
    @IsEnum(UserColumnOptions, { message: 'Criterio de búsqueda no admitido' })
    key: UserColumnOptions;

    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de busqueda no admitido' })
    operator: SearchOperators;

    @Validate(UserSearchValueValidator)
    value: string | number | Date;

    @IsOptional()
    @Validate(UserSearchValueValidator)
    valueEnd?: string | number | Date;
}

export class UserFindFilters {
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(UserColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: UserColumnOptions;

    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El tipo de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC';

    @IsNotEmpty({ message: 'La paginación es obligatoria' })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto;

    @IsOptional()
    @Type(() => UserPropertySearch)
    @ValidateNested()
    query?: UserPropertySearch;

    @IsOptional()
    @Transform(({ value }) => value == true)
    @IsBoolean({
        message:
            'Si se incluye la especificación de usuarios inactivos la propiedad debe ser un booleano',
    })
    includeInactives?: boolean;

    @IsOptional()
    @Transform(({ value }) => value == true)
    @IsBoolean({
        message:
            'Si se incluye la especificación de usuarios bloqueados la propiedad debe ser un booleano',
    })
    includeBlockeds: boolean;
}
