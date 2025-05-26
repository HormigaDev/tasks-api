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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { TasksService } from './tasks.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { TaskFindFilters } from './DTOs/task-find-filter.dto';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { CreateTaskDto } from './DTOs/create-task.dto';
import { UpdateTaskDto } from './DTOs/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class TasksController {
    constructor(private readonly service: TasksService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadTasks])
    async getTasks(@Query() filters: TaskFindFilters) {
        const [tasks, count] = await this.service.find(filters);
        return { tasks, count };
    }

    @Get('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadTasks])
    async getTask(@Param('id', IdPipe) id: number) {
        const task = await this.service.findById(id);
        return { task };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateTasks])
    async createTask(@Body() body: CreateTaskDto) {
        const task = await this.service.create(body);
        return { task };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateTasks])
    async updateTask(@Param('id', IdPipe) id: number, @Body() body: UpdateTaskDto) {
        const task = await this.service.update(id, body);
        return { task, message: 'Tarea actualizada correctamente' };
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteTasks])
    async deleteTask(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
