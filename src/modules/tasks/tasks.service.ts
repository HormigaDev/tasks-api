import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/database/model/entities/task.entity';
import { Repository } from 'typeorm';
import { ContextService } from '../context/context.service';
import { UtilsService } from 'src/common/services/utils.service';
import { CreateTaskDto } from './DTOs/create-task.dto';
import { CategoriesService } from '../categories/categories.service';
import { Priority } from 'src/database/model/entities/priority.entity';
import { TaskStatus } from 'src/database/model/entities/task-status.entity';
import { Tag } from 'src/database/model/entities/tag.entity';
import { Attachment } from 'src/database/model/entities/attachment.entity';
import { TaskFindFilters } from './DTOs/task-find-filter.dto';
import { FindResult } from 'src/common/interfaces/find-result.interface';
import { UpdateTaskDto } from './DTOs/update-task.dto';
import { TooManyRequestsException } from 'src/common/types/TooManyRequestsException.type';
import { MilestonesService } from '../milestones/milestones.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class TasksService extends UtilsService<Task> {
    constructor(
        @InjectRepository(Task) private readonly _repository: Repository<Task>,
        private readonly context: ContextService,
        private readonly categoriesService: CategoriesService,
        private readonly milestonesService: MilestonesService,
        private readonly logs: LogsService,
    ) {
        super(_repository, 'TasksService');
    }

    private get repository(): Repository<Task> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(Task) : this._repository;
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

    private async setTags(tagsId: number[], task: Task) {
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

                task.tags = tags;
            }
        } catch (err) {
            this.handleError('setTags', err);
        }
    }

    private async setAttachments(attachmentsId: number[], task: Task) {
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

                task.attachments = attachments;
            }
        } catch (err) {
            this.handleError('setAttachments', err);
        }
    }

    async create(dto: CreateTaskDto): Promise<Task> {
        try {
            const createTask = async () => {
                this.logs.setEntity(Task);
                const category = await this.categoriesService.findById(dto.category);
                const priority = await this.getPriority(dto.priority);

                const task = new Task();
                task.title = dto.title;
                task.description = dto.description;
                task.category = category;
                task.priority = priority;
                task.status = TaskStatus.pending;
                task.user = this.context.user;

                if (dto.milestone) {
                    await this.milestonesService.validateTasksPerMilestoneLimit(dto.milestone);
                    const milestone = await this.milestonesService.findById(dto.milestone);
                    task.milestone = milestone;
                }

                await this.setTags(dto.tags, task);
                await this.setAttachments(dto.attachments, task);

                const savedTask = await this.context.getEntityManager().save(task);
                await this.logs.setNew(savedTask.id);
                await this.logs.save();

                return savedTask;
            };

            return this.context.getEntityManager()
                ? await createTask()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await createTask();
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

    async findById(id: number): Promise<Task> {
        try {
            const task = await this.repository
                .createQueryBuilder('t')
                .innerJoin('t.user', 'user')
                .leftJoinAndSelect('t.tags', 'tag')
                .leftJoinAndSelect('t.attachments', 'a')
                .where('t.id = :id and user.id = :user', { id, user: this.context.user.id })
                .getOne();

            if (!task) {
                throw new NotFoundException(`Tarea con el ID "${id}" no encontrada`);
            }

            return task;
        } catch (err) {
            this.handleError('findById', err);
        }
    }

    async find(filters: TaskFindFilters): Promise<FindResult<Task>> {
        try {
            const query = this.repository
                .createQueryBuilder('task')
                .orderBy(`task.${filters.orderBy}`, filters.order);

            this.setPagination(query, filters.pagination);

            if (filters.query) {
                this.setQueryFilter('task', query, filters.query);
            }

            return await query
                .andWhere('task.user.id = :user', { user: this.context.user.id })
                .leftJoinAndSelect('task.category', 'category')
                .leftJoinAndSelect('task.priority', 'priority')
                .leftJoinAndSelect('task.tags', 'tags')
                .leftJoinAndSelect('task.attachments', 'attachments')
                .getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async update(id: number, dto: UpdateTaskDto): Promise<Task> {
        try {
            const updateTask = async () => {
                this.logs.setEntity(Task);
                await this.findById(id);
                await this.logs.setOld(id);
                let props: Record<string, any> = {};
                if (dto.title) props.title = dto.title;
                if (dto.description) props.description = dto.description;
                if (dto.priority) {
                    const priority = await this.getPriority(dto.priority);
                    props.priority = priority.id;
                }
                if (dto.category) {
                    const category = await this.categoriesService.findById(dto.category);
                    props.category = category.id;
                }

                if (dto.milestone) {
                    const milestone = await this.milestonesService.findById(dto.milestone);
                    props.milestone = milestone.id;
                }

                if (Object.keys(props).length === 0) {
                    throw new BadRequestException('Ningún dato informado para actualizar la tarea');
                }

                await this.repository
                    .createQueryBuilder()
                    .update()
                    .set(props)
                    .where('id = :id and user.id = :user', { id, user: this.context.user.id })
                    .execute();

                await this.logs.setNew(id);
                await this.logs.save();

                return await this.findById(id);
            };

            return this.context.getEntityManager()
                ? await updateTask()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateTask();
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

    async setTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        try {
            const updateTask = async () => {
                this.logs.setEntity(Task);
                await this.findById(id);
                await this.logs.setOld(id);
                await this.repository
                    .createQueryBuilder()
                    .update()
                    .set({ status })
                    .where('id = :id and user.id = :user', { id, user: this.context.user.id })
                    .execute();

                await this.logs.setNew(id);
                await this.logs.save();

                return await this.findById(id);
            };

            return this.context.getEntityManager()
                ? await updateTask()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateTask();
                      } catch (error) {
                          throw error;
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('setTaskStatus', err);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const deleteTask = async () => {
                this.logs.setEntity(Task);
                await this.findById(id);
                await this.logs.setOld(id);
                await this.repository.delete(id);
                await this.logs.save();
            };
            return this.context.getEntityManager()
                ? await deleteTask()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await deleteTask();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('delete', err);
        }
    }

    async validateTasksLimit(): Promise<void> {
        try {
            const count = await this.repository.count({ where: { user: this.context.user } });
            if (count >= this.context.user.limits.maxTasks) {
                throw new TooManyRequestsException('Límite de tareas alcanzado');
            }
        } catch (err) {
            this.handleError('valdiateTasksLimit', err);
        }
    }
}
