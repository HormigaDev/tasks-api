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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserPropertySearch {
    @ApiProperty({ description: 'El criterio de búsqueda es obligatorio', enum: UserColumnOptions })
    @IsNotEmpty({ message: 'El criterio de búsqueda es obligatorio' })
    @IsEnum(UserColumnOptions, { message: 'Criterio de búsqueda no admitido' })
    key: UserColumnOptions;

    @ApiProperty({ description: 'El operador de búsqueda es obligatorio', enum: SearchOperators })
    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de busqueda no admitido' })
    operator: SearchOperators;

    @ApiProperty({
        description: 'Valor de búsqueda',
        oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'string', format: 'date-time' }],
    })
    @Validate(UserSearchValueValidator)
    value: string | number | Date;

    @ApiPropertyOptional({
        description: 'Valor final para búsquedas por rango',
        oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'string', format: 'date-time' }],
    })
    @IsOptional()
    @Validate(UserSearchValueValidator)
    valueEnd?: string | number | Date;
}

export class UserFindFilters {
    @ApiPropertyOptional({
        description: 'Criterio de ordenación',
        example: 'id',
        enum: UserColumnOptions,
        default: UserColumnOptions.Id,
    })
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(UserColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: UserColumnOptions = UserColumnOptions.Id;

    @ApiPropertyOptional({
        description: 'Tipo de ordenación',
        example: 'ASC',
        enum: ['ASC', 'DESC'],
        default: 'DESC',
    })
    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El tipo de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({ type: PaginationDto, description: 'Datos de paginación' })
    @IsNotEmpty({ message: 'La paginación es obligatoria' })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto = new PaginationDto();

    @ApiPropertyOptional({
        type: UserPropertySearch,
        description: 'Criterios de búsqueda avanzada',
    })
    @IsOptional()
    @Type(() => UserPropertySearch)
    @ValidateNested()
    query?: UserPropertySearch;

    @ApiPropertyOptional({ description: 'Incluir usuarios inactivos', example: false })
    @IsOptional()
    @Transform(({ value }) => value == true)
    @IsBoolean({
        message:
            'Si se incluye la especificación de usuarios inactivos la propiedad debe ser un booleano',
    })
    includeInactives?: boolean;

    @ApiPropertyOptional({ description: 'Incluir usuarios bloqueados', example: false })
    @IsOptional()
    @Transform(({ value }) => value == true)
    @IsBoolean({
        message:
            'Si se incluye la especificación de usuarios bloqueados la propiedad debe ser un booleano',
    })
    includeBlockeds?: boolean;
}
