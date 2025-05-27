import { Sizes } from 'src/common/Sizes';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_limits')
export class UserLimits {
    @PrimaryGeneratedColumn()
    id: number;

    // Tareas, Etiquetas, Categorías
    @Column({ name: 'max_tasks', type: 'integer', default: 1000 })
    maxTasks: number;

    @Column({ name: 'max_tags', type: 'integer', default: 30 })
    maxTags: number;

    @Column({ name: 'max_categories', type: 'integer', default: 10 })
    maxCategories: number;

    // Comentarios
    @Column({ name: 'max_comments', type: 'integer', default: 5000 })
    maxComments: number;

    // Hitos
    @Column({ name: 'max_milestones', type: 'integer', default: 500 })
    maxMilestones: number;

    // Archivos adjuntos
    @Column({ name: 'max_attachments_storage', type: 'integer', default: Sizes.megabytes(100) })
    maxAttachmentsStorage: number;

    // TODO: Implementar las columnas 'max_task_comments', 'max_subtask_comments', 'max_milestones_per_task', 'mask_milestones_per_subtask'

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
