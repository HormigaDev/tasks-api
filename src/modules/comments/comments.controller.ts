import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { CommentsService } from './comments.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { CommentFindFilters } from './DTOs/comment-find-filters.dto';
import { CreateCommentDto } from './DTOs/create-comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class CommentsController {
    constructor(private readonly service: CommentsService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadComments])
    async getComments(@Query() filters: CommentFindFilters) {
        const [comments, count] = await this.service.find(filters);
        return { comments, count };
    }

    // ? El resto de funciones CRUD está en el websocket
}
