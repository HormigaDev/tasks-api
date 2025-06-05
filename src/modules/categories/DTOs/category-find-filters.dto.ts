import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginationDto } from 'src/common/validators/pagination.dto';
import { CategoryColumnOptions } from '../enums/CategoryColumnOptions.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryFindFiltersDto {
    @ApiPropertyOptional({
        description: 'Texto para filtrar la búsqueda',
        type: String,
        example: 'nombre',
    })
    @IsOptional()
    @IsString({ message: 'El criterio de busqueda debe ser un texto válido' })
    query?: string;

    @ApiProperty({
        description: 'Campo para ordenar los resultados',
        enum: CategoryColumnOptions,
        example: CategoryColumnOptions.Id,
    })
    @IsNotEmpty({ message: 'El valor para ordenar es obligatorio' })
    @IsEnum(CategoryColumnOptions, { message: 'Valor para ordenar no admitido' })
    orderBy: CategoryColumnOptions = CategoryColumnOptions.Id;

    @ApiProperty({
        description: 'Tipo de ordenación de los resultados',
        enum: ['ASC', 'DESC'],
        example: 'DESC',
    })
    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], { message: 'El criterio de ordenación debe ser "ASC" o "DESC"' })
    order: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({
        description: 'Datos de paginación',
        type: () => PaginationDto,
    })
    @Type(() => PaginationDto)
    @ValidateNested({ always: true })
    pagination: PaginationDto = new PaginationDto();
}
