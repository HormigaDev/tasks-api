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
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { CategoryFindFiltersDto } from './DTOs/category-find-filters.dto';
import { CreateCategoryDto } from './DTOs/create-category.dto';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { UpdateCategoryDto } from './DTOs/update-category.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('Categories')
@ApiBearerAuth('jwt-token')
@Controller('categories')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class CategoriesController {
    constructor(private readonly service: CategoriesService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadCategories])
    @ApiOperation({ summary: 'Obtener listado de categorías con filtros' })
    @ApiQuery({ name: 'filters', type: CategoryFindFiltersDto, required: false })
    @ApiResponse({ status: 200, description: 'Listado de categorías obtenido' })
    async findCategories(@Query() filters: CategoryFindFiltersDto) {
        const [categories, count] = await this.service.find(filters);
        return { categories, count };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateCategories])
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: 'Categoría creada correctamente' })
    async createCategory(@Body() body: CreateCategoryDto) {
        await this.service.validateCategoriesLimit();
        const category = await this.service.create(body);
        return { category };
    }

    @Patch('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.UpdateCategories])
    @ApiOperation({ summary: 'Actualizar una categoría por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la categoría' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({ status: 200, description: 'Categoría actualizada correctamente' })
    async updateCategory(@Param('id', IdPipe) id: number, @Body() body: UpdateCategoryDto) {
        await this.service.update(id, body);
        return { message: 'Categoría actualizada con éxito' };
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteCategories])
    @ApiOperation({ summary: 'Eliminar una categoría por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la categoría' })
    @ApiResponse({ status: 204, description: 'Categoría eliminada correctamente' })
    async deleteCategory(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
