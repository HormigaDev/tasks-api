import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInterface } from 'src/common/interfaces/pagination.interface';
import { ServiceInterface } from 'src/common/interfaces/service.interface';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';
import { UtilsService } from 'src/common/services/utils.service';
import { CreateUserDto } from 'src/common/validators/create-user.dto';
import { UpdateUserDto } from 'src/common/validators/update-user.dto';
import { In, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { UserStatus } from 'src/common/enums/UserStatus.enum';

@Injectable()
export class UsersService
    extends UtilsService<User, UpdateUserDto>
    implements ServiceInterface<User, CreateUserDto, UpdateUserDto>
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly authService: AuthService,
    ) {
        super(usersRepository, 'UsersService');
    }

    async findAll(pagination: PaginationInterface): Promise<User[]> {
        try {
            if (pagination.page < 1 || pagination.limit < 1) {
                throw new BadRequestException('Invalid pagination');
            }
            const users = await this.usersRepository
                .createQueryBuilder('user')
                .select([
                    'user.id',
                    'user.email',
                    'user.name',
                    'user.status',
                    'user.createdAt',
                    'user.lastUpdate',
                ])
                .leftJoinAndSelect('user.roles', 'role')
                .skip(this.page(pagination))
                .take(pagination.limit)
                .where('status = :status', { status: UserStatus.Active })
                .getMany();

            return users;
        } catch (error) {
            this.handleError('findAll', error);
        }
    }

    async findOne(id: number, includeRoles: boolean = false): Promise<User> {
        try {
            let query = this.usersRepository
                .createQueryBuilder('user')
                .where('user.id = :id', { id });

            if (includeRoles) {
                query = query.leftJoinAndSelect('user.roles', 'role');
            }

            const user = await query.getOne();
            if (!user) {
                throw new NotFoundException('Usuario no encontrado.');
            }
            if (includeRoles) {
                const isAdmin = user.roles.some((role) => {
                    return (role.permissions & Permissions.Admin) === Permissions.Admin;
                });
                user.isAdmin = isAdmin;
            }
            return user;
        } catch (error) {
            this.handleError('findOne', error);
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOneBy({ email });
            await this.validateStatus(user.id);
            return user;
        } catch (error) {
            this.handleError('findOneByEmail', error);
        }
    }

    async existsUserByEmail(email: string): Promise<void> {
        try {
            const exists = !!(await this.findOneByEmail(email));
            if (exists) {
                throw new BadRequestException('User already exists');
            }
        } catch (error) {
            this.handleError('existsUserByEmail', error);
        }
    }

    async create(dto: CreateUserDto): Promise<User> {
        try {
            const queryRunner = this.usersRepository.manager.connection.createQueryRunner();

            await queryRunner.startTransaction();
            try {
                await this.existsUserByEmail(dto.email);
                const user = new User();
                user.email = dto.email;
                user.password = await this.authService.hashPassword(dto.password);
                user.name = dto.name;

                const savedUser = await queryRunner.manager.save(User, user);
                const roles = await queryRunner.manager.find(Role, {
                    where: { id: In(dto.roles) },
                });

                if (roles.length !== dto.roles.length) {
                    throw new BadRequestException('Uno o más roles no existen.');
                }

                savedUser.roles = roles;
                await queryRunner.manager.save(User, savedUser);
                await queryRunner.commitTransaction();
                return savedUser;
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            this.handleError('create', error);
        }
    }

    async update(id: number, dto: UpdateUserDto): Promise<User> {
        try {
            await this.validateStatus(id);
            await this.findOne(id);
            await this.updateEntity(id, dto);
            return await this.findOne(id);
        } catch (error) {
            this.handleError('update', error);
        }
    }

    async delete(id: number): Promise<User> {
        try {
            return await this.setUserStatus(id, UserStatus.Deleted);
        } catch (error) {
            this.handleError('delete', error);
        }
    }

    async banUser(id: number): Promise<User> {
        try {
            return await this.setUserStatus(id, UserStatus.Blocked);
        } catch (error) {
            this.handleError('banUser', error);
        }
    }

    async inactiveUser(id: number): Promise<User> {
        try {
            return await this.setUserStatus(id, UserStatus.Inactive);
        } catch (error) {
            this.handleError('inactiveUser', error);
        }
    }

    async activeUser(id: number): Promise<User> {
        try {
            return await this.setUserStatus(id, UserStatus.Active);
        } catch (error) {
            this.handleError('activeUser', error);
        }
    }

    async setUserPassword(id: number, password: string): Promise<void> {
        try {
            await this.validateStatus(id);
            await this.usersRepository
                .createQueryBuilder()
                .update()
                .set({ password: await this.authService.hashPassword(password) })
                .where('id = :id', { id })
                .execute();
        } catch (error) {
            this.handleError('setUserPassword', error);
        }
    }

    private async setUserStatus(id: number, status: UserStatus) {
        await this.validateStatus(id);
        const user = await this.findOne(id);
        await this.usersRepository
            .createQueryBuilder()
            .update()
            .set({ status })
            .where('id = :id', { id })
            .execute();

        user.status = status;
        return user;
    }

    private async validateStatus(id: number) {
        const user = await this.findOne(id);
        switch (user.status) {
            case UserStatus.Inactive:
                throw new ForbiddenException('Usuario inactivo.');
            case UserStatus.Blocked:
                throw new ForbiddenException('Usuario bloqueado.');
            case UserStatus.Deleted:
                throw new ForbiddenException('Usuario no encontrado.');
            default:
                throw new InternalServerErrorException('Estado de usuario desconocido.');
        }
    }
}
