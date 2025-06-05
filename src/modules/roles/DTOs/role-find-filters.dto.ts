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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleFindQueryDto {
    @ApiProperty({
        description: 'Clave para el criterio de búsqueda',
        enum: RolesColumnOptions,
    })
    @IsNotEmpty({ message: 'La clave de búsqueda es obligatoria' })
    @IsEnum(RolesColumnOptions, { message: 'Clave de búsqueda no admitida' })
    key: RolesColumnOptions;

    @ApiProperty({
        description: 'Operador para la búsqueda',
        enum: SearchOperators,
    })
    @IsNotEmpty({ message: 'El operador de búsqueda es obligatorio' })
    @IsEnum(SearchOperators, { message: 'Operador de búsqueda no admitido' })
    operator: SearchOperators;

    @ApiProperty({
        description: 'Valor principal para la búsqueda',
    })
    @IsNotEmpty({ message: 'El valor de búsqueda es obligatorio' })
    @Validate(RolesSearchValueValidator)
    value: string | number;

    @ApiPropertyOptional({
        description: 'Valor final para búsqueda entre rangos (opcional)',
    })
    @IsOptional()
    @Validate(RolesSearchValueValidator)
    valueEnd?: string | number;
}

export class RoleFindFilters {
    @ApiPropertyOptional({
        description: 'Criterio de ordenación',
        enum: RolesColumnOptions,
        default: RolesColumnOptions.Id,
    })
    @IsNotEmpty({ message: 'El criterio de ordenación es obligatorio' })
    @IsEnum(RolesColumnOptions, { message: 'Criterio de ordenación no admitido' })
    orderBy: RolesColumnOptions = RolesColumnOptions.Id;

    @ApiPropertyOptional({
        description: 'Tipo de ordenación (ASC o DESC)',
        example: 'DESC',
        enum: ['ASC', 'DESC'],
    })
    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsString({ message: 'El tipo de ordenación debe ser un texto válido' })
    @IsIn(['ASC', 'DESC'], {
        message: 'El tipo de ordenación solo puede ser "ASC" o "DESC" (sensible a mayúsculas)',
    })
    order: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({
        description: 'Datos de paginación',
        type: PaginationDto,
    })
    @IsNotEmpty({ message: 'La paginación es obligatoria' })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto = new PaginationDto();

    @ApiPropertyOptional({
        description: 'Consulta avanzada opcional para búsqueda',
        type: RoleFindQueryDto,
    })
    @IsOptional()
    @Type(() => RoleFindQueryDto)
    @ValidateNested()
    query?: RoleFindQueryDto;
}
