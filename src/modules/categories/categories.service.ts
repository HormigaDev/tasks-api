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
import { TooManyRequestsException } from 'src/common/types/TooManyRequestsException.type';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class CategoriesService extends UtilsService<Category> {
    constructor(
        @InjectRepository(Category) private readonly _repository: Repository<Category>,
        private readonly context: ContextService,
        private readonly logs: LogsService,
    ) {
        super(_repository, 'CategoriesService');
    }

    private get repository(): Repository<Category> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(Category) : this._repository;
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        try {
            const createCategory = async () => {
                this.logs.setEntity(Category);
                if (await this.findByName(dto.name)) {
                    throw new ConflictException(
                        `Ya existe una categoría con el nombre "${dto.name}"`,
                    );
                }

                const category = new Category();
                category.name = dto.name;
                category.icon = dto.icon || null;
                category.color = dto.color;
                category.user = this.context.user;

                const savedCategory = await this.repository.save(category);
                await this.logs.setNew(savedCategory.id);
                delete savedCategory.user;
                return savedCategory;
            };

            return this.context.getEntityManager()
                ? await createCategory()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await createCategory();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async find(filters: CategoryFindFiltersDto): Promise<FindResult<Category>> {
        try {
            const query = this.repository
                .createQueryBuilder('cat')
                .orderBy(`cat.${filters.orderBy}`, filters.order)
                .innerJoin('cat.user', 'user')
                .where('user.id = :user', { user: this.context.user.id });
            this.setPagination(query, filters.pagination);
            if (filters.query) {
                query.andWhere('cat.name ilike :value', { value: `%${filters.query}%` });
            }

            return await query.getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async findById(id: number) {
        const category = await this.repository
            .createQueryBuilder('cat')
            .where('cat.id = :id and user.id = :user', { id, user: this.context.user.id })
            .leftJoin('cat.user', 'user')
            .getOne();
        if (!category) {
            throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }

        return category;
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
        try {
            const updateCategory = async () => {
                this.logs.setEntity(Category);
                const category = await this.findById(id);
                if (dto.name && category.name !== dto.name && (await this.findByName(dto.name))) {
                    throw new ConflictException(
                        `Ya existe una categoría con el nombre "${dto.name}"`,
                    );
                }
                await this.logs.setOld(id);
                await this.updateEntity(id, dto, this.repository);
                await this.logs.setNew(id);
                await this.logs.save();
                return await this.findById(id);
            };

            return this.context.getEntityManager()
                ? await updateCategory()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateCategory();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('update', err);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const deleteCategory = async () => {
                this.logs.setEntity(Category);
                await this.logs.setOld(id);
                await this.findById(id);
                await this.repository.delete({ id });
                await this.logs.save();
            };

            return this.context.getEntityManager()
                ? await deleteCategory()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await deleteCategory();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('delete', err);
        }
    }

    async findByName(name: string) {
        const category = await this.repository
            .createQueryBuilder('cat')
            .where('user.id = :user and cat.name = :name', {
                user: this.context.user.id,
                name,
            })
            .leftJoin('cat.user', 'user')
            .getOne();
        return category;
    }

    async validateCategoriesLimit(): Promise<void> {
        try {
            const count = await this.repository.count({ where: { user: this.context.user } });
            if (count >= this.context.user.limits.maxCategories) {
                throw new TooManyRequestsException('Límite de categorías alcanzado');
            }
        } catch (err) {
            this.handleError('validateCategoriesLimit', err);
        }
    }
}
