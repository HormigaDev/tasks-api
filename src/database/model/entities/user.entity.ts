import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    AfterLoad,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { UserStatus } from './user-status.entity';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { UserLimits } from './user-limit.entity';

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

    @ManyToOne(() => UserStatus, { nullable: false, eager: true })
    status: UserStatus;

    @OneToMany(() => UserLimits, (userLimits) => userLimits.user, { eager: true })
    limits: UserLimits;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'last_update', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastUpdate: Date;

    @ManyToMany(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
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
    hasPermission(permission: Permissions) {
        if (!this.permissions) return false;
        return (this.permissions & permission) === permission;
    }
}
