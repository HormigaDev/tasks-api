import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { DatabaseOperation } from 'src/common/enums/DatabaseOperation.enum';

@Entity('history_logs')
export class HistoryLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'record_id', type: 'integer', nullable: false })
    recordId: number;

    @Column({ name: 'table_name', type: 'varchar', length: 100, nullable: false })
    table: string;

    @Column({
        name: 'history_action',
        type: 'enum',
        enumName: 'history_logs_action',
        enum: DatabaseOperation,
    })
    action: DatabaseOperation;

    @Column({ type: 'jsonb', nullable: false })
    details: Record<string, any>;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
