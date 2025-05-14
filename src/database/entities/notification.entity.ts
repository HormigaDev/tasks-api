import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @ManyToOne(() => User, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'scheduled_for', type: 'timestamp', nullable: false })
    scheduledFor: Date;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
