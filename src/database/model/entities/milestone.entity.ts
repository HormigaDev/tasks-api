import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Repository,
    OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

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

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'expected_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    expectedDate: Date;

    @OneToMany(() => Task, (task) => task.milestone)
    tasks: Task[];

    completionPercentage: number;

    async getCompletionPercentage(repository: Repository<Task>) {
        const { total, completed } = await repository
            .createQueryBuilder('t')
            .select([
                'count(case when t.status.id != 3 then 1 end) as total',
                'count(case when t.status.id = 2 then 1 end) as completed',
            ])
            .where('t.milestone.id = :milestone', { milestone: this.id })
            .getRawOne();

        const totalCount = parseInt(total, 10);
        const completedCount = parseInt(completed, 10);
        this.completionPercentage =
            totalCount === 0 ? 0 : Math.round((completedCount * 10000) / totalCount) / 100;

        return this.completionPercentage;
    }
}
