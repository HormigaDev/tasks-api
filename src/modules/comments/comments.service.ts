import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from 'src/common/services/utils.service';
import { Comment } from 'src/database/model/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './DTOs/create-comment.dto';
import { WsException } from '@nestjs/websockets';
import { User } from 'src/database/model/entities/user.entity';
import { Task } from 'src/database/model/entities/task.entity';
import { Subtask } from 'src/database/model/entities/subtask.entity';
import { EditCommentDto } from './DTOs/edit-comment.dto';
import { ContextService } from '../context/context.service';
import { FindResult } from 'src/common/interfaces/find-result.interface';
import { CommentFindFilters } from './DTOs/comment-find-filters.dto';
import { TooManyRequestsException } from 'src/common/types/TooManyRequestsException.type';

@Injectable()
export class CommentsService extends UtilsService<Comment> {
    constructor(
        @InjectRepository(Comment) private readonly _repository: Repository<Comment>,
        private readonly context: ContextService,
    ) {
        super(_repository, 'CommentsService');
    }

    private get repository(): Repository<Comment> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(Comment) : this._repository;
    }

    async create(dto: CreateCommentDto): Promise<Comment> {
        try {
            return await this.repository.manager.transaction(async (manager) => {
                const comment = new Comment();
                if (!dto.user?.id) {
                    throw new WsException('Usuario no informado en el comentario');
                }

                const tasksRepository = manager.getRepository(Task);
                const task = await tasksRepository.findOneBy({
                    id: dto.taskId,
                    user: dto.user, // TODO: Implementar forma de compartir tareas con otros usuarios
                });
                if (!task) {
                    throw new WsException(`Tarea con ID "${dto.taskId}" no encontrada`);
                }

                comment.user = dto.user;
                comment.content = dto.content;
                comment.edited = false;

                const savedComment = await manager.save(comment);

                if (dto.subtaskId) {
                    const subtasksRepository = manager.getRepository(Subtask);
                    const subtask = await subtasksRepository.findOneBy({
                        id: dto.taskId,
                        task,
                    });
                    if (!subtask) {
                        throw new WsException(`Tarea con ID "${dto.taskId}" no encontrada`);
                    }

                    await manager
                        .createQueryBuilder()
                        .relation(Subtask, 'comments')
                        .of(dto.subtaskId)
                        .add(savedComment);

                    return savedComment;
                }

                await manager
                    .createQueryBuilder()
                    .relation(Task, 'comments')
                    .of(dto.taskId)
                    .add(savedComment);

                return savedComment;
            });
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async findById(id: number, user: User): Promise<Comment> {
        try {
            const comment = await this.repository.findOneBy({ id, user });
            if (!comment) {
                throw new WsException(`Comentario con ID "${id}" no encontrado`);
            }

            return comment;
        } catch (err) {
            this.handleError('findById', err);
        }
    }

    async find(filters: CommentFindFilters): Promise<FindResult<Comment>> {
        try {
            const query = this.repository
                .createQueryBuilder('comment')
                .orderBy('comment.createdAt', 'DESC');
            this.setPagination(query, filters.pagination);

            return await query.getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async edit(dto: EditCommentDto): Promise<Comment> {
        try {
            return await this.repository.manager.transaction(async (manager) => {
                const commentRepo = manager.getRepository(Comment);

                const comment = await commentRepo.findOne({
                    where: { id: dto.id, user: dto.user },
                    relations: ['user'],
                });

                if (!comment) {
                    throw new WsException(`Comentario con ID "${dto.id}" no encontrado`);
                }

                comment.content = dto.content;
                comment.edited = true;

                return await manager.save(comment);
            });
        } catch (err) {
            this.handleError('edit', err);
        }
    }

    async delete(id: number, user: User): Promise<void> {
        try {
            await this.findById(id, user);
            await this.repository.delete(id);
        } catch (err) {
            this.handleError('delete', err);
        }
    }

    async validateCommentsLimit(_user?: User) {
        try {
            const user = _user || this.context.user;
            const count = await this.repository.count({ where: { user } });
            if (count >= user.limits.maxComments) {
                throw new TooManyRequestsException('Límite de comentarios alcanzado');
            }
        } catch (err) {
            this.handleError('validateCommentsLimit', err);
        }
    }
}
