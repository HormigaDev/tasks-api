import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from 'src/common/services/utils.service';
import { Milestone } from 'src/database/model/entities/milestone.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateMilestoneDto } from './DTOs/create-milestone.dto';
import { UpdateMilestoneDto } from './DTOs/update-milestone.dto';

@Injectable()
export class MilestonesService extends UtilsService<Milestone> {
    constructor(@InjectRepository(Milestone) private readonly repository: Repository<Milestone>) {
        super(repository, 'MilestonesService');
    }

    async create(dto: CreateMilestoneDto, manager: EntityManager = null): Promise<Milestone> {
        try {
            const milestone = new Milestone();
            milestone.title = dto.title;
            milestone.description = dto.description;
            milestone.expectedDate = dto.expectedDate || new Date();
            milestone.completed = false;

            const em = manager || this.repository.manager;
            return await em.save(milestone);
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async findById(id: number): Promise<Milestone> {
        try {
            const milestone = await this.repository.findOneBy({ id });
            if (!milestone) {
                throw new NotFoundException(`Hito con el ID "${id}" no encontrado`);
            }

            return milestone;
        } catch (err) {
            this.handleError('findById', err);
        }
    }

    async update(
        id: number,
        dto: UpdateMilestoneDto,
        manager: EntityManager = null,
    ): Promise<Milestone> {
        try {
            await this.findById(id);
            const repository = manager ? manager.getRepository(Milestone) : null;
            await this.updateEntity(id, dto, repository);
            return repository.findOneBy({ id });
        } catch (err) {
            this.handleError('update', err);
        }
    }

    async delete(id: number, manager: EntityManager = null): Promise<void> {
        try {
            await this.findById(id);
            const em = manager || this.repository.manager;

            await em.delete(Milestone, id);
        } catch (err) {
            this.handleError('delete', err);
        }
    }
}
