import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from 'src/common/services/utils.service';
import { Tag } from 'src/database/model/entities/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './DTOs/create-tag.dto';
import { ContextService } from '../context/context.service';
import { TagFindFiltersDto } from './DTOs/tag-find-filters.dto';
import { FindResult } from 'src/common/interfaces/find-result.interface';
import { UpdateTagDto } from './DTOs/update-tag.dto';
import { TooManyRequestsException } from 'src/common/types/TooManyRequestsException.type';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class TagsService extends UtilsService<Tag> {
    constructor(
        @InjectRepository(Tag)
        private readonly _repository: Repository<Tag>,
        private readonly context: ContextService,
        private readonly logs: LogsService,
    ) {
        super(_repository, 'TagsService');
    }

    private get repository(): Repository<Tag> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(Tag) : this._repository;
    }

    async create(dto: CreateTagDto): Promise<Tag> {
        try {
            const createTag = async () => {
                this.logs.setEntity(Tag);

                if (await this.findByName(dto.name)) {
                    throw new ConflictException(
                        `Ya existe una etiqueta con el nombre "${dto.name}"`,
                    );
                }

                const tag = new Tag();
                tag.name = dto.name;
                tag.user = this.context.user;
                tag.color = dto.color;

                const savedTag = await this.repository.save(tag);

                await this.logs.setNew(savedTag.id);
                await this.logs.save();

                return savedTag;
            };

            return this.context.getEntityManager()
                ? await createTag()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await createTag();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async findByName(name: string): Promise<Tag | null> {
        try {
            const tag = await this.repository.findOneBy({ name, user: this.context.user });
            return tag;
        } catch (err) {
            this.handleError('findByName', err);
        }
    }

    async findById(id: number): Promise<Tag> {
        try {
            const tag = await this.repository
                .createQueryBuilder('tag')
                .leftJoin('tag.user', 'user')
                .where('tag.id = :id and user.id = :user', {
                    id,
                    user: this.context.user.id,
                })
                .getOne();
            if (!tag) {
                throw new NotFoundException(`No se encontró la etiqueta con el id "${id}"`);
            }
            return tag;
        } catch (err) {
            this.handleError('findById', err);
        }
    }

    async find(filters: TagFindFiltersDto): Promise<FindResult<Tag>> {
        try {
            const query = this.repository
                .createQueryBuilder('tag')
                .orderBy(`tag.${filters.orderBy}`, filters.order);

            if (filters.query) {
                query.andWhere('tag.name ilike :value', { value: `%${filters.query}%` });
            }

            this.setPagination(query, filters.pagination);
            return await query.getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async update(id: number, dto: UpdateTagDto): Promise<Tag> {
        try {
            const updateTag = async () => {
                this.logs.setEntity(Tag);
                await this.findById(id);
                await this.logs.setOld(id);
                await this.updateEntity(id, dto, this.repository);
                await this.logs.setNew(id);
                await this.logs.save();
                return await this.findById(id);
            };

            return this.context.getEntityManager()
                ? await updateTag()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateTag();
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
            const deleteTag = async () => {
                this.logs.setEntity(Tag);
                await this.findById(id);
                await this.logs.setOld(id);
                await this.repository.delete(id);
                await this.logs.save();
            };

            return this.context.getEntityManager()
                ? await deleteTag()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await deleteTag();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('delete', err);
        }
    }

    async validateTagsLimit(): Promise<void> {
        try {
            const count = await this.repository.count({ where: { user: this.context.user } });
            if (count >= this.context.user.limits.maxTags) {
                throw new TooManyRequestsException('Límite de etiquetas alcanzado');
            }
        } catch (err) {
            this.handleError('validateTagsLimit', err);
        }
    }
}
