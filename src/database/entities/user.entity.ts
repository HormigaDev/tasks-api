import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, AfterLoad } from 'typeorm';
import { Role } from './role.entity';
import { UserStatus } from 'src/common/enums/UserStatus.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ name: 'status_id', type: 'integer', nullable: false, default: UserStatus.Active })
    status: UserStatus;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'last_update', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastUpdate: Date;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];

    isAdmin: boolean;
    permissions: number;

    @AfterLoad()
    computePermissios() {
        let combinedPermissions = 0;
        this.roles?.forEach((role) => {
            combinedPermissions |= role.permissions;
        });

        this.permissions = combinedPermissions;
    }
}
