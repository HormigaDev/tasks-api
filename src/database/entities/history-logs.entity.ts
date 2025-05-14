import { HistoryLogsAction } from 'src/common/enums/HistoryLogsAction.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('history_logs')
export class HistoryLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'history_action',
        type: 'enum',
        enumName: 'history_logs_action',
        enum: HistoryLogsAction,
    })
    action: HistoryLogsAction;

    @Column({ type: 'jsonb', nullable: false })
    details: Record<string, any>;

    @ManyToOne(() => User, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
