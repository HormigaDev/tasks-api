import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subtask } from 'src/database/model/entities/subtask.entity';
import { Repository } from 'typeorm';
import { ContextService } from '../context/context.service';
import { UtilsService } from 'src/common/services/utils.service';
import { CreateSubtaskDto } from './DTOs/create-subtask.dto';
import { Priority } from 'src/database/model/entities/priority.entity';
import { TaskStatus } from 'src/database/model/entities/task-status.entity';
import { Tag } from 'src/database/model/entities/tag.entity';
import { Attachment } from 'src/database/model/entities/attachment.entity';
import { SubtaskFindFilters } from './DTOs/subtask-find-filters.dto';
import { FindResult } from 'src/common/interfaces/find-result.interface';
import { UpdateSubtaskDto } from './DTOs/update-subtask.dto';
import { TasksService } from '../tasks/tasks.service';
import { TooManyRequestsException } from 'src/common/types/TooManyRequestsException.type';

@Injectable()
export class SubtasksService extends UtilsService<Subtask> {
    constructor(
        @InjectRepository(Subtask) private readonly _repository: Repository<Subtask>,
        private readonly context: ContextService,
        private readonly tasksService: TasksService,
    ) {
        super(_repository, 'SubtasksService');
    }

    private get repository(): Repository<Subtask> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(Subtask) : this._repository;
    }

    async create(dto: CreateSubtaskDto): Promise<Subtask> {
        try {
            return await this.repository.manager.transaction(async (manager) => {
                try {
                    this.context.setEntityManager(manager);
                    const task = await this.tasksService.findById(dto.taskId);
                    await this.validateSubtasksPerTaskLimit(task.id);

                    const priority = await this.getPriority(dto.priority);
                    const subtask = new Subtask();
                    subtask.title = dto.title;
                    subtask.description = dto.description;
                    subtask.priority = priority;
                    subtask.status = TaskStatus.pending;
                    subtask.task = task;

                    await this.setTags(dto.tags, subtask);
                    await this.setAttachments(dto.attachments, subtask);

                    return await manager.save(subtask);
                } catch (error) {
                    throw error;
                } finally {
                    this.context.releaseEntityManager();
                }
            });
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async findById(id: number): Promise<Subtask> {
        try {
            const subtask = await this.repository.findOne({
                where: { id },
                select: {
                    tags: true,
                    attachments: true,
                    id: true,
                    title: true,
                    description: true,
                    task: {
                        id: true,
                        user: {
                            id: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    priority: {
                        id: true,
                        name: true,
                    },
                    status: {
                        id: true,
                        name: true,
                    },
                },
            });

            if (!subtask || subtask.task.user.id !== this.context.user.id) {
                throw new NotFoundException(`Tarea con el ID "${id}" no encontrada`);
            }

            return subtask;
        } catch (err) {
            this.handleError('findById', err);
        }
    }

    async find(filters: SubtaskFindFilters): Promise<FindResult<Subtask>> {
        try {
            const query = this.repository
                .createQueryBuilder('subtask')
                .orderBy(`subtask.${filters.orderBy}`, filters.order);

            this.setPagination(query, filters.pagination);

            if (filters.query) {
                this.setQueryFilter('subtask', query, filters.query);
            }

            return await query
                .andWhere('subtask.task.id = :task', { task: filters.taskId })
                .leftJoinAndSelect('subtask.priority', 'priority')
                .leftJoinAndSelect('subtask.tags', 'tags')
                .leftJoinAndSelect('subtask.attachments', 'attachments')
                .getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async update(id: number, dto: UpdateSubtaskDto): Promise<Subtask> {
        try {
            await this.findById(id);
            return await this.repository.manager.transaction(async (manager) => {
                try {
                    this.context.setEntityManager(manager);
                    let props: Record<string, any> = {};
                    if (dto.title) props.title = dto.title;
                    if (dto.description) props.description = dto.description;
                    if (dto.priority) {
                        const priority = await this.getPriority(dto.priority);
                        props.priority = priority.id;
                    }

                    if (Object.keys(props).length === 0) {
                        throw new BadRequestException(
                            'Ningún dato informado para actualizar la tarea',
                        );
                    }

                    await this.repository
                        .createQueryBuilder('subtask')
                        .update()
                        .set(props)
                        .where('subtask.id = :id and subtask.task.id = :task', {
                            id,
                            task: dto.taskId,
                        })
                        .execute();

                    return await this.findById(id);
                } catch (error) {
                    throw error;
                } finally {
                    this.context.releaseEntityManager();
                }
            });
        } catch (err) {
            this.handleError('update', err);
        }
    }

    async setSubtaskStatus(id: number, status: TaskStatus): Promise<Subtask> {
        try {
            return await this.repository.manager.transaction(async (manager) => {
                try {
                    this.context.setEntityManager(manager);
                    await this.findById(id);
                    await this.repository
                        .createQueryBuilder('subtask')
                        .update()
                        .set({ status })
                        .where('subtask.id = :id', { id })
                        .execute();

                    return await this.findById(id);
                } catch (error) {
                    throw error;
                } finally {
                    this.context.releaseEntityManager();
                }
            });
        } catch (err) {
            this.handleError('setSubtaskStatus', err);
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

    private async validateSubtasksPerTaskLimit(id: number): Promise<void> {
        try {
            const count = await this.repository.count({ where: { task: { id } } });
            if (count >= this.context.user.limits.maxSubtasksPerTask) {
                throw new TooManyRequestsException('Límite de subtareas por tarea alcanzado');
            }
        } catch (err) {
            this.handleError('validateSubtasksPerTaskLimit', err);
        }
    }

    private async getPriority(id: number): Promise<Priority> {
        try {
            const manager = this.context.getEntityManager() || this.repository.manager;
            const repository = manager.getRepository(Priority);
            const priority = repository.findOneBy({ id });
            if (!priority) {
                throw new NotFoundException(`Prioridad con ID "${id}" no encontrada`);
            }

            return priority;
        } catch (err) {
            this.handleError('getPriority', err);
        }
    }

    private async setTags(tagsId: number[], subtask: Subtask) {
        try {
            const manager = this.context.getEntityManager({ throwError: true });
            if (tagsId && tagsId.length > 0) {
                const tagsRepository = manager.getRepository(Tag);
                const tags = await tagsRepository
                    .createQueryBuilder('tag')
                    .select(['tag.id'])
                    .where('tag.id in (:...tags)', { tags: tagsId })
                    .getMany();

                if (tags.length !== tagsId.length) {
                    throw new BadRequestException('Una o más etiquetas no existen');
                }

                subtask.tags = tags;
            }
        } catch (err) {
            this.handleError('setTags', err);
        }
    }

    private async setAttachments(attachmentsId: number[], subtask: Subtask) {
        try {
            const manager = this.context.getEntityManager({ throwError: true });
            if (attachmentsId && attachmentsId.length > 0) {
                const attachmentRepository = manager.getRepository(Attachment);
                const attachments = await attachmentRepository
                    .createQueryBuilder('a')
                    .select(['a.id'])
                    .where('a.id in (:...attachments)', { attachments: attachmentsId })
                    .getMany();

                if (attachments.length !== attachmentsId.length) {
                    throw new BadRequestException('Uno o más archivos adjuntos no existen');
                }

                subtask.attachments = attachments;
            }
        } catch (err) {
            this.handleError('setAttachments', err);
        }
    }
}
