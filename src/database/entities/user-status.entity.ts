import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_status')
export class UserStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string;
}
