import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationDto } from 'src/common/validators/pagination.dto';

export class CommentFindFilters {
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination: PaginationDto;
}
