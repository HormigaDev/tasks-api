import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string;
}
