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
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
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

@ApiTags('Tasks')
@ApiBearerAuth('jwt-token')
@Controller('tasks')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class TasksController {
    constructor(private readonly service: TasksService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadTasks])
    @ApiOperation({ summary: 'Obtener lista de tareas con filtros' })
    @ApiQuery({ name: 'filters', type: TaskFindFilters, required: false })
    @ApiResponse({ status: 200, description: 'Listado de tareas obtenido correctamente' })
    async getTasks(@Query() filters: TaskFindFilters) {
        const [tasks, count] = await this.service.find(filters);
        return { tasks, count };
    }

    @Get('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadTasks])
    @ApiOperation({ summary: 'Obtener una tarea por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la tarea' })
    @ApiResponse({ status: 200, description: 'Tarea obtenida correctamente' })
    async getTask(@Param('id', IdPipe) id: number) {
        const task = await this.service.findById(id);
        return { task };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateTasks])
    @ApiOperation({ summary: 'Crear una nueva tarea' })
    @ApiResponse({ status: 201, description: 'Tarea creada correctamente' })
    async createTask(@Body() body: CreateTaskDto) {
        await this.service.validateTasksLimit();
        const task = await this.service.create(body);
        return { task };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateTasks])
    @ApiOperation({ summary: 'Actualizar una tarea existente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la tarea a actualizar' })
    @ApiResponse({ status: 200, description: 'Tarea actualizada correctamente' })
    async updateTask(@Param('id', IdPipe) id: number, @Body() body: UpdateTaskDto) {
        const task = await this.service.update(id, body);
        return { task, message: 'Tarea actualizada correctamente' };
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteTasks])
    @ApiOperation({ summary: 'Eliminar una tarea por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la tarea a eliminar' })
    @ApiResponse({ status: 204, description: 'Tarea eliminada correctamente' })
    async deleteTask(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
