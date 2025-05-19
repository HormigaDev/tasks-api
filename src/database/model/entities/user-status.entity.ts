import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_status')
export class UserStatus {
    static Active: number = 1;
    static Inactive: number = 2;
    static Blocked: number = 3;
    static Deleted: number = 4;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string;
}
