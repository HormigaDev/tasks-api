import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { CommentsService } from './comments.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { CommentFindFilters } from './DTOs/comment-find-filters.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth('jwt-token')
@Controller('comments')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class CommentsController {
    constructor(private readonly service: CommentsService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadComments])
    @ApiOperation({ summary: 'Obtener lista de comentarios con filtros' })
    @ApiQuery({ name: 'filters', type: CommentFindFilters, required: false })
    @ApiResponse({ status: 200, description: 'Listado de comentarios obtenido correctamente' })
    async getComments(@Query() filters: CommentFindFilters) {
        const [comments, count] = await this.service.find(filters);
        return { comments, count };
    }

    // ? Nota: El resto de funcionalidades CRUD se manejan vía WebSocket
}
