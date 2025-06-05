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
import { MilestonesService } from './milestones.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { MilestoneFindFilters } from './DTOs/milestone-find-filters.dto';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { CreateMilestoneDto } from './DTOs/create-milestone.dto';
import { UpdateMilestoneDto } from './DTOs/update-milestone.dto';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Milestones')
@ApiBearerAuth('jwt-token')
@Controller('milestones')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class MilestonesController {
    constructor(private readonly service: MilestonesService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadMilestones])
    @ApiOperation({ summary: 'Obtener lista de hitos con filtros' })
    @ApiQuery({ name: 'filters', type: MilestoneFindFilters, required: false })
    @ApiResponse({ status: 200, description: 'Listado de hitos obtenido correctamente' })
    async getMilestones(@Query() filters: MilestoneFindFilters) {
        const [milestones, count] = await this.service.find(filters);
        return { milestones, count };
    }

    @Get('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadMilestones])
    @ApiOperation({ summary: 'Obtener un hito por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del hito' })
    @ApiResponse({ status: 200, description: 'Hito obtenido correctamente' })
    async getMilestone(@Param('id', IdPipe) id: number) {
        const milestone = await this.service.findById(id);
        return { milestone };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateMilestones])
    @ApiOperation({ summary: 'Crear un nuevo hito' })
    @ApiResponse({ status: 201, description: 'Hito creado correctamente' })
    async createMilestone(@Body() body: CreateMilestoneDto) {
        const milestone = await this.service.create(body);
        return { milestone };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateMilestones])
    @ApiOperation({ summary: 'Actualizar un hito existente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del hito a actualizar' })
    @ApiResponse({ status: 200, description: 'Hito actualizado con éxito' })
    async updateMilestone(@Param('id', IdPipe) id: number, @Body() body: UpdateMilestoneDto) {
        await this.service.update(id, body);
        return { message: 'Hito actualizado con éxito' };
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteMilestones])
    @ApiOperation({ summary: 'Eliminar un hito por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del hito a eliminar' })
    @ApiResponse({ status: 204, description: 'Hito eliminado correctamente' })
    async deleteMilestone(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
