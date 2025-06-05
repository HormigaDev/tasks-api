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
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Subtasks')
@ApiBearerAuth('jwt-token')
@Controller('subtasks')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class SubtasksController {
    constructor(private readonly service: SubtasksService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadSubtasks])
    @ApiOperation({ summary: 'Obtener lista de subtareas con filtros' })
    @ApiQuery({ name: 'filters', type: SubtaskFindFilters, required: false })
    @ApiResponse({ status: 200, description: 'Listado de subtareas obtenido correctamente' })
    async getSubtasks(@Query() filters: SubtaskFindFilters) {
        const [subtasks, count] = await this.service.find(filters);
        return { subtasks, count };
    }

    @Get('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadSubtasks])
    @ApiOperation({ summary: 'Obtener una subtarea por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la subtarea' })
    @ApiResponse({ status: 200, description: 'Subtarea obtenida correctamente' })
    async getSubtask(@Param('id', IdPipe) id: number) {
        const subtask = await this.service.findById(id);
        return { subtask };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateSubtasks])
    @ApiOperation({ summary: 'Crear una nueva subtarea' })
    @ApiResponse({ status: 201, description: 'Subtarea creada correctamente' })
    async createSubtask(@Body() body: CreateSubtaskDto) {
        const subtask = await this.service.create(body);
        return { subtask };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateSubtasks])
    @ApiOperation({ summary: 'Actualizar una subtarea existente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la subtarea a actualizar' })
    @ApiResponse({ status: 200, description: 'Subtarea actualizada correctamente' })
    async updateSubtask(@Param('id', IdPipe) id: number, @Body() body: UpdateSubtaskDto) {
        await this.service.update(id, body);
        return { message: 'Subtarea actualizada con éxito' };
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteSubtasks])
    @ApiOperation({ summary: 'Eliminar una subtarea por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la subtarea a eliminar' })
    @ApiResponse({ status: 204, description: 'Subtarea eliminada correctamente' })
    async deleteSubtask(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
