import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';
import { IsNotNaN } from 'src/common/validators/is-not-nan.dto';
import { PaginationDto } from 'src/common/validators/pagination.dto';

export class CommentFindFilters {
    @IsNotEmpty({ message: 'El ID de la tarea es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El ID de la tarea debe ser un número válido' })
    @IsNotNaN({ message: 'El ID de la tarea debe ser un número válido' })
    @Min(1, { message: 'El ID de la tarea debe ser mayor que 0' })
    readonly taskId: number;

    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto = new PaginationDto();
}
