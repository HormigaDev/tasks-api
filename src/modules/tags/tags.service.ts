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

@Injectable()
export class TagsService extends UtilsService<Tag> {
    constructor(
        @InjectRepository(Tag)
        private readonly repository: Repository<Tag>,
        private readonly context: ContextService,
    ) {
        super(repository, 'TagsService');
    }

    async create(dto: CreateTagDto): Promise<Tag> {
        try {
            if (await this.findByName(dto.name)) {
                throw new ConflictException(`Ya existe una etiqueta con el nombre "${dto.name}"`);
            }
            const tag = new Tag();
            tag.name = dto.name;
            tag.user = this.context.user;
            tag.color = dto.color;

            return await this.repository.save(tag);
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
            const tag = await this.repository.findOneBy({ id, user: this.context.user });
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
            await this.repository.delete(id);
        } catch (err) {
            this.handleError('delete', err);
        }
    }
}
