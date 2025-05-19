import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/model/entities/category.entity';
import { Repository } from 'typeorm';
import { UtilsService } from 'src/common/services/utils.service';
import { CreateCategoryDto } from './DTOs/create-category.dto';
import { ContextService } from '../context/context.service';
import { UpdateCategoryDto } from './DTOs/update-category.dto';
import { CategoryFindFiltersDto } from './DTOs/category-find-filters.dto';
import { FindResult } from 'src/common/interfaces/find-result.interface';

@Injectable()
export class CategoriesService extends UtilsService<Category> {
    constructor(
        @InjectRepository(Category) private readonly repository: Repository<Category>,
        private _context: ContextService,
    ) {
        super(repository, 'CategoriesService', _context);
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        try {
            if (await this.findByName(dto.name)) {
                throw new ConflictException(`Ya existe una categoría con el nombre "${dto.name}"`);
            }

            const category = new Category();
            category.name = dto.name;
            category.icon = dto.icon || null;
            category.color = dto.color;
            category.user = this.user;

            return await this.repository.save(category);
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async find(filters: CategoryFindFiltersDto): Promise<FindResult<Category>> {
        try {
            let query = this.repository
                .createQueryBuilder('cat')
                .orderBy(`cat.${filters.orderBy}`, filters.order);
            query = this.setPagination(query, filters.pagination);
            if (filters.query) {
                query = query.andWhere('cat.name ilike :value', { value: `%${filters.query}%` });
            }

            return await query.getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async findById(id: number) {
        const category = await this.repository.findOneBy({ id, user: this.user });
        if (!category) {
            throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }

        return category;
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
        try {
            await this.findById(id);
            await this.updateEntity(id, dto);
            return await this.findById(id);
        } catch (err) {
            this.handleError('update', err);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.findById(id);
            await this.repository.delete({ id });
        } catch (err) {
            this.handleError('delete', err);
        }
    }

    async findByName(name: string) {
        const category = await this.repository.findOneBy({ name, user: this.user });
        return category;
    }
}
