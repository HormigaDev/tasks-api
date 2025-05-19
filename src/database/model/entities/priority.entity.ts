import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('priorities')
export class Priority {
    static Low: number = 1;
    static Normal: number = 2;
    static High: number = 3;
    static Urgent: number = 4;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string;
}
