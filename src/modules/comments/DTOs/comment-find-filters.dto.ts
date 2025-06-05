import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';
import { IsNotNaN } from 'src/common/validators/is-not-nan.dto';
import { PaginationDto } from 'src/common/validators/pagination.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommentFindFilters {
    @ApiProperty({
        description: 'ID de la tarea para la cual se buscan los comentarios',
        example: 42,
        minimum: 1,
        type: Number,
    })
    @IsNotEmpty({ message: 'El ID de la tarea es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El ID de la tarea debe ser un número válido' })
    @IsNotNaN({ message: 'El ID de la tarea debe ser un número válido' })
    @Min(1, { message: 'El ID de la tarea debe ser mayor que 0' })
    readonly taskId: number;

    @ApiPropertyOptional({
        description: 'Parámetros de paginación para la búsqueda de comentarios',
        type: () => PaginationDto,
    })
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto = new PaginationDto();
}
