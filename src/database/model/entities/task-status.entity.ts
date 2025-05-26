import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_status')
export class TaskStatus {
    static Pending: number = 1;
    static Completed: number = 2;
    static Cancelled: number = 3;

    static get pending(): TaskStatus {
        const status = new TaskStatus();
        status.id = TaskStatus.Pending;
        return status;
    }
    static get completed(): TaskStatus {
        const status = new TaskStatus();
        status.id = TaskStatus.Completed;
        return status;
    }
    static get cancelled(): TaskStatus {
        const status = new TaskStatus();
        status.id = TaskStatus.Cancelled;
        return status;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string;
}
