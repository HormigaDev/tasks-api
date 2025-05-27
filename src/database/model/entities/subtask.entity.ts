import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.entity';
import { Priority } from './priority.entity';
import { Tag } from './tag.entity';
import { Attachment } from './attachment.entity';
import { Comment } from './comment.entity';

@Entity('subtasks')
export class Subtask {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Task, { nullable: false })
    @JoinColumn({ name: 'task_id' })
    task: Task;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => TaskStatus, { nullable: false, eager: true })
    status: TaskStatus;

    @ManyToOne(() => Priority, { nullable: false, eager: true })
    priority: Priority;

    @ManyToMany(() => Tag)
    @JoinTable({
        joinColumn: {
            name: 'subtask_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    tags: Tag[];

    @ManyToMany(() => Comment)
    @JoinTable({
        joinColumn: {
            name: 'subtask_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'comment_id',
            referencedColumnName: 'id',
        },
    })
    comments: Comment[];

    @ManyToMany(() => Attachment)
    @JoinTable({
        joinColumn: {
            name: 'subtask_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'attachment_id',
            referencedColumnName: 'id',
        },
    })
    attachments: Attachment[];
}
