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
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { TagsService } from './tags.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { TagFindFiltersDto } from './DTOs/tag-find-filters.dto';
import { CreateTagDto } from './DTOs/create-tag.dto';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { UpdateTagDto } from './DTOs/update-tag.dto';

@ApiTags('Tags')
@ApiBearerAuth('jwt-token')
@Controller('tags')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class TagsController {
    constructor(private readonly service: TagsService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadTags])
    @ApiOperation({ summary: 'Obtener lista de etiquetas con filtros' })
    @ApiQuery({ name: 'filters', type: TagFindFiltersDto, required: false })
    @ApiResponse({ status: 200, description: 'Listado de etiquetas obtenido correctamente' })
    async getTags(@Query() filters: TagFindFiltersDto) {
        const [tags, count] = await this.service.find(filters);
        return { tags, count };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateTags])
    @ApiOperation({ summary: 'Crear una nueva etiqueta' })
    @ApiResponse({ status: 201, description: 'Etiqueta creada correctamente' })
    async createTag(@Body() body: CreateTagDto) {
        await this.service.validateTagsLimit();
        const tag = await this.service.create(body);
        return { tag };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateTags])
    @ApiOperation({ summary: 'Actualizar una etiqueta existente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la etiqueta a actualizar' })
    @ApiResponse({ status: 200, description: 'Etiqueta actualizada correctamente' })
    async updateTag(@Param('id', IdPipe) id: number, @Body() body: UpdateTagDto) {
        await this.service.update(id, body);
        return { message: 'Etiqueta actualizada con éxito' };
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteTags])
    @ApiOperation({ summary: 'Eliminar una etiqueta por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la etiqueta a eliminar' })
    @ApiResponse({ status: 204, description: 'Etiqueta eliminada correctamente' })
    async deleteTag(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
