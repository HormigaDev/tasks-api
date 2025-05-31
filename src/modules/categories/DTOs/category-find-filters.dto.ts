import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginationDto } from 'src/common/validators/pagination.dto';
import { CategoryColumnOptions } from '../enums/CategoryColumnOptions.enum';

export class CategoryFindFiltersDto {
    @IsOptional()
    @IsString({ message: 'El criterio de busqueda debe ser un texto válido' })
    query?: string;

    @IsNotEmpty({ message: 'El valor para ordenar es obligatorio' })
    @IsEnum(CategoryColumnOptions, { message: 'Valor para ordenar no admitido' })
    orderBy: CategoryColumnOptions = CategoryColumnOptions.Id;

    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El criterio de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC' = 'DESC';

    @Type(() => PaginationDto)
    @ValidateNested({ always: true })
    pagination: PaginationDto = new PaginationDto();
}
