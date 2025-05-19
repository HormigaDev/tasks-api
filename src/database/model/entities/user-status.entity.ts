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

    static get active() {
        const status = new UserStatus();
        status.id = UserStatus.Active;
        status.name = 'Activo';
        return status;
    }

    static get inactive() {
        const status = new UserStatus();
        status.id = UserStatus.Inactive;
        status.name = 'Inactivo';
        return status;
    }

    static get blocked() {
        const status = new UserStatus();
        status.id = UserStatus.Blocked;
        status.name = 'Bloqueado';
        return status;
    }

    static get deleted() {
        const status = new UserStatus();
        status.id = UserStatus.Deleted;
        status.name = 'Eliminado';
        return status;
    }
}
