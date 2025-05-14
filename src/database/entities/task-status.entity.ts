import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_status')
export class TaskStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string;
}
