import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_status')
export class TaskStatus {
    static Pending: number = 1;
    static Completed: number = 2;
    static Cancelled: number = 3;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string;
}
