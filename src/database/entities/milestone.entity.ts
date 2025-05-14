import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('milestones')
export class Milestone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'boolean', default: false })
    completed: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    expectedDate: Date;
}
