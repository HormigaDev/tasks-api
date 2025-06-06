import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { TaskStatus } from './task-status.entity';
import { Priority } from './priority.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Milestone } from './milestone.entity';
import { Subtask } from './subtask.entity';
import { Attachment } from './attachment.entity';
import { Comment } from './comment.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => User, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => TaskStatus, { nullable: false, eager: true })
    @JoinColumn({ name: 'status_id' })
    status: TaskStatus;

    @ManyToOne(() => Priority, { nullable: false, eager: true })
    @JoinColumn({ name: 'priority_id' })
    priority: Priority;

    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Milestone, { nullable: true })
    @JoinColumn({ name: 'milestone_id' })
    milestone: Milestone;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToMany(() => Tag, { cascade: true })
    @JoinTable({
        name: 'task_tags',
        joinColumn: {
            name: 'task_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    tags: Tag[];

    @ManyToMany(() => Comment, { cascade: true })
    @JoinTable({
        name: 'task_comments',
        joinColumn: {
            name: 'task_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'comment_id',
            referencedColumnName: 'id',
        },
    })
    comments: Comment[];

    @ManyToMany(() => Attachment, { cascade: true })
    @JoinTable({
        name: 'task_attachments',
        joinColumn: {
            name: 'task_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'attachment_id',
            referencedColumnName: 'id',
        },
    })
    attachments: Attachment[];

    @OneToMany(() => Subtask, (subtask) => subtask.task)
    subtasks: Subtask[];
}
