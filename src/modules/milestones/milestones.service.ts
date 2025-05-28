import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from 'src/common/services/utils.service';
import { Milestone } from 'src/database/model/entities/milestone.entity';
import { Repository } from 'typeorm';
import { CreateMilestoneDto } from './DTOs/create-milestone.dto';
import { UpdateMilestoneDto } from './DTOs/update-milestone.dto';
import { ContextService } from '../context/context.service';
import { TooManyRequestsException } from 'src/common/types/TooManyRequestsException.type';
import { FindResult } from 'src/common/interfaces/find-result.interface';
import { MilestoneFindFilters } from './DTOs/milestone-find-filters.dto';
import { Task } from 'src/database/model/entities/task.entity';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class MilestonesService extends UtilsService<Milestone> {
    constructor(
        @InjectRepository(Milestone) private readonly _repository: Repository<Milestone>,
        private readonly context: ContextService,
        private readonly logs: LogsService,
    ) {
        super(_repository, 'MilestonesService');
    }
    private get repository(): Repository<Milestone> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(Milestone) : this._repository;
    }

    async create(dto: CreateMilestoneDto): Promise<Milestone> {
        try {
            const createMilestone = async () => {
                this.logs.setEntity(Milestone);
                const milestone = new Milestone();
                milestone.title = dto.title;
                milestone.description = dto.description;
                milestone.expectedDate = dto.expectedDate || new Date();
                milestone.completed = false;

                const savedMilestone = await this.repository.save(milestone);
                await this.logs.setNew(savedMilestone.id);
                await this.logs.save();

                return savedMilestone;
            };
            return this.context.getEntityManager()
                ? await createMilestone()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await createMilestone();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async findById(id: number): Promise<Milestone> {
        try {
            const milestone = await this.repository
                .createQueryBuilder('m')
                .select([
                    'm.id',
                    'm.title',
                    'm.description',
                    'm.completed',
                    'task.id',
                    'task.title',
                    'task.status',
                ])
                .innerJoin('m.tasks', 'task')
                .where('m.id = :id', { id })
                .getOne();

            if (!milestone) {
                throw new NotFoundException(`Hito con el ID "${id}" no encontrado"`);
            }

            // Calcula el porcentaje de finalización según las tareas vinculadas
            milestone.getCompletionPercentage(this.repository.manager.getRepository(Task));

            return milestone;
        } catch (err) {
            this.handleError('findById', err);
        }
    }

    async find(filters: MilestoneFindFilters): Promise<FindResult<Milestone>> {
        try {
            const query = this.repository
                .createQueryBuilder('milestone')
                .orderBy(`milestone.${filters.orderBy}`, filters.order);
            this.setPagination(query, filters.pagination);

            if (filters.query) {
                this.setQueryFilter('milestone', query, filters.query);
            }

            return await query
                .andWhere('milestone.user.id = :user', { user: this.context.user.id })
                .getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async update(id: number, dto: UpdateMilestoneDto): Promise<Milestone> {
        try {
            const updateMilestone = async () => {
                this.logs.setEntity(Milestone);
                await this.findById(id);
                await this.logs.setOld(id);
                await this.updateEntity(id, dto, this.repository);
                await this.logs.setNew(id);
                await this.logs.save();
                return this.repository.findOneBy({ id });
            };
            return this.context.getEntityManager()
                ? await updateMilestone()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateMilestone();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('update', err);
        }
    }

    async completeMilestone(id: number): Promise<boolean> {
        try {
            const updateMilestone = async () => {
                this.logs.setEntity(Milestone);
                await this.logs.setOld(id);
                const milestone = await this.findById(id);
                const tasksRepository = this.repository.manager.getRepository(Task);
                if ((await milestone.getCompletionPercentage(tasksRepository)) < 100) {
                    return false;
                }

                await this.repository
                    .createQueryBuilder('m')
                    .update()
                    .set({ completed: true })
                    .where('m.id = :id', { id })
                    .execute();

                await this.logs.setNew(id);
                await this.logs.save();

                return true;
            };
            return this.context.getEntityManager()
                ? await updateMilestone()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateMilestone();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('completeMilestone', err);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const deleteMilestone = async () => {
                this.logs.setEntity(Milestone);
                await this.findById(id);
                await this.logs.setOld(id);
                await this.repository.delete(id);
                await this.logs.save();
            };
            return this.context.getEntityManager()
                ? await deleteMilestone()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await deleteMilestone();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('delete', err);
        }
    }

    async validateMilestonesLimit(): Promise<void> {
        try {
            const query = await this.repository.manager.query(
                `
                select
                    count(m.id) as count
                from milestones m
                where user_id = $1
            `,
                [this.context.user.id],
            );
            const count: number = query.count;
            if (count >= this.context.user.limits.maxMilestones) {
                throw new TooManyRequestsException('Límite de hitos alcanzado');
            }
        } catch (err) {
            this.handleError('validateMilestonesLimit', err);
        }
    }

    async validateTasksPerMilestoneLimit(id: number): Promise<void> {
        try {
            const query = await this.repository.manager.query(
                `
                select
                    count(*) as count
                from tasks
                where milestone_id = $1 and user_id = $2
            `,
                [id, this.context.user.id],
            );

            const count: number = query.count;
            if (count >= this.context.user.limits.maxTasksPerMilestone) {
                throw new TooManyRequestsException('Límite de tareas por hito alcanzado');
            }
        } catch (err) {
            this.handleError('validateTasksPerMilestoneLimit', err);
        }
    }
}
