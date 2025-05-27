import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { SubtaskFindFilters } from './DTOs/subtask-find-filters.dto';
import { SubtasksService } from './subtasks.service';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { CreateSubtaskDto } from './DTOs/create-subtask.dto';
import { UpdateSubtaskDto } from './DTOs/update-subtask.dto';

@Controller('subtasks')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class SubtasksController {
    constructor(private readonly service: SubtasksService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadSubtasks])
    async getSubtasks(@Query() filters: SubtaskFindFilters) {
        const [subtasks, count] = await this.service.find(filters);
        return { subtasks, count };
    }

    @Get('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadSubtasks])
    async getSubtask(@Param('id', IdPipe) id: number) {
        const subtask = await this.service.findById(id);
        return { subtask };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateSubtasks])
    async createSubtask(@Body() body: CreateSubtaskDto) {
        const subtask = await this.service.create(body);
        return { subtask };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateSubtasks])
    async updateSubtask(@Param('id', IdPipe) id: number, @Body() body: UpdateSubtaskDto) {
        await this.service.update(id, body);
        return { message: 'Subtarea actualizada con éxito' };
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteSubtasks])
    async deleteSubtask(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
