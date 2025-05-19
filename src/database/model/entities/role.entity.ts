import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string;

    @Column({ type: 'integer' })
    permissions: number;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
