import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/validators/pagination.dto';
import { TagColumnOptions } from '../enums/TagColumnOptions.enum';

export class TagFindFiltersDto {
    @ApiPropertyOptional({
        description: 'Criterio de búsqueda para filtrar las etiquetas',
        type: String,
        example: 'importante',
    })
    @IsOptional()
    @IsString({ message: 'El criterio de busqueda debe ser un texto válido' })
    query?: string;

    @ApiProperty({
        description: 'Columna por la cual ordenar el resultado',
        enum: TagColumnOptions,
        example: TagColumnOptions.Id,
    })
    @IsNotEmpty({ message: 'El valor para ordenar es obligatorio' })
    @IsEnum(TagColumnOptions, { message: 'Valor para ordenar no admitido' })
    orderBy: TagColumnOptions = TagColumnOptions.Id;

    @ApiProperty({
        description: 'Tipo de ordenación',
        enum: ['ASC', 'DESC'],
        example: 'DESC',
    })
    @IsNotEmpty({ message: 'El tipo de ordenación es obligatorio' })
    @IsIn(['ASC', 'DESC'], {
        message: 'El criterio de ordenación debe ser "ASC" o "DESC"',
    })
    order: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({
        description: 'Parámetros de paginación',
        type: PaginationDto,
    })
    @Type(() => PaginationDto)
    @ValidateNested({ always: true })
    pagination: PaginationDto = new PaginationDto();
}
