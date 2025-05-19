import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginationDto } from 'src/common/validators/pagination.dto';
import { TagColumnOptions } from '../enums/TagColumnOptions.enum';

export class TagFindFiltersDto {
    @IsOptional()
    @IsString({ message: 'El criterio de busqueda debe ser un texto válido' })
    query?: string;

    @IsNotEmpty({ message: 'El valor para ordenar es obligatorio' })
    @IsEnum(TagColumnOptions, { message: 'Valor para ordenar no admitido' })
    orderBy: TagColumnOptions;

    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El criterio de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC';

    @Type(() => PaginationDto)
    @ValidateNested({ always: true })
    pagination: PaginationDto;
}
