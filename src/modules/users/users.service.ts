import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/model/entities/user.entity';
import { Role } from 'src/database/model/entities/role.entity';
import { UtilsService } from 'src/common/services/utils.service';
import { CreateUserDto } from 'src/modules/users/DTOs/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/DTOs/update-user.dto';
import { In, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { UserStatus } from 'src/database/model/entities/user-status.entity';
import { FindResult } from 'src/common/interfaces/find-result.interface';
import { UserFindFilters } from './DTOs/user-find-filters.dto';
import { ContextService } from '../context/context.service';
import { LogsService } from '../logs/logs.service';
import { TooManyRequestsException } from 'src/common/types/TooManyRequestsException.type';

@Injectable()
export class UsersService extends UtilsService<User> {
    constructor(
        @InjectRepository(User)
        private readonly _repository: Repository<User>,
        private readonly authService: AuthService,
        private readonly context: ContextService,
        private readonly logs: LogsService,
    ) {
        super(_repository, 'UsersService');
    }

    private get repository(): Repository<User> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(User) : this._repository;
    }

    async find(filters: UserFindFilters): Promise<FindResult<User>> {
        try {
            const status = [UserStatus.Active];
            if (filters.includeInactives) {
                status.push(UserStatus.Inactive);
            }
            if (filters.includeBlockeds) {
                status.push(UserStatus.Blocked);
            }

            let query = this.repository
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
                .where('user.status.id in (:...status)', { status });

            query = this.setPagination(query, filters.pagination).orderBy(
                `user.${filters.orderBy}`,
                filters.order,
            );

            if (filters.query) {
                query = this.setQueryFilter('user', query, filters.query);
            }

            return await query.getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async findById(id: number, { includeRoles } = { includeRoles: false }): Promise<User> {
        try {
            let query = this.repository
                .createQueryBuilder('user')
                .where('user.id = :id', { id })
                .andWhere('user.status.id in (:...status)', {
                    status: [UserStatus.Active, UserStatus.Inactive, UserStatus.Blocked],
                });

            if (includeRoles) {
                query = query.leftJoinAndSelect('user.roles', 'role');
            }

            const user = await query.getOne();
            if (!user) {
                throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
            }
            if (includeRoles) {
                const isAdmin = user.roles.some((role) => {
                    return (role.permissions & Permissions.Admin) === Permissions.Admin;
                });
                user.isAdmin = isAdmin;
            }
            return user;
        } catch (err) {
            this.handleError('findById', err);
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            const user = await this.repository.findOneBy({ email });
            await this.validateStatus(user.id);
            return user;
        } catch (err) {
            this.handleError('findOneByEmail', err);
        }
    }

    async existsUserByEmail(email: string): Promise<void> {
        try {
            const exists = !!(await this.findOneByEmail(email));
            if (exists) {
                throw new BadRequestException('User already exists');
            }
        } catch (err) {
            this.handleError('existsUserByEmail', err);
        }
    }

    async create(dto: CreateUserDto): Promise<User> {
        try {
            const createUser = async () => {
                this.logs.setEntity(User);
                await this.existsUserByEmail(dto.email);
                const user = new User();

                user.email = dto.email;
                user.name = dto.name;
                user.password = await this.authService.hashPassword(dto.password);
                user.status = UserStatus.active;

                const manager = this.context.getEntityManager();

                const savedUser = await manager.save(User, user);
                if (dto.roles.length >= savedUser.limits.maxRoles) {
                    throw new TooManyRequestsException('Límite de roles por usuario alcanzado');
                }
                const roles = await manager.find(Role, {
                    where: { id: In(dto.roles) },
                });

                if (roles.length !== dto.roles.length) {
                    throw new BadRequestException('Uno o más roles no existen');
                }

                savedUser.roles = roles;
                await this.logs.setNew(savedUser.id);
                await this.logs.save();
                return await manager.save(savedUser);
            };

            return this.context.getEntityManager()
                ? await createUser()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await createUser();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async update(id: number, dto: UpdateUserDto): Promise<User> {
        try {
            const updateUser = async () => {
                this.logs.setEntity(User);
                await this.validateStatus(id);
                await this.findById(id);
                await this.logs.setOld(id);
                await this.updateEntity(id, dto, this.repository);
                await this.logs.setNew(id);
                await this.logs.save();
                return await this.findById(id);
            };

            return this.context.getEntityManager()
                ? await updateUser()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateUser();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('update', err);
        }
    }

    async updateUserRoles(id: number, roles: number[]): Promise<User> {
        try {
            const updateUser = async () => {
                this.logs.setEntity(User);
                await this.validateStatus(id);
                const user = await this.findById(id, { includeRoles: true });
                if (roles.length >= user.limits.maxRoles) {
                    throw new TooManyRequestsException('Límite de roles por usuario alcanzado');
                }
                await this.logs.setOld(user.id, { roles: user.roles.map((r) => r.id) });
                const newRoles = await this.repository.manager.find(Role, {
                    where: { id: In(roles) },
                });

                if (newRoles.length !== roles.length) {
                    throw new BadRequestException('Uno o más roles no existen');
                }

                await this.repository
                    .createQueryBuilder()
                    .update()
                    .set({ roles: newRoles })
                    .where('id = :id', { id })
                    .execute();

                await this.logs.setNew(user.id, { roles: newRoles.map((r) => r.id) });
                await this.logs.save();

                return await this.findById(id, { includeRoles: true });
            };

            return this.context.getEntityManager()
                ? await updateUser()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateUser();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('updateUserRoles', err);
        }
    }

    async delete(id: number): Promise<User> {
        try {
            return await this.setUserStatus(id, UserStatus.deleted);
        } catch (err) {
            this.handleError('delete', err);
        }
    }

    async setUserPassword(id: number, password: string): Promise<void> {
        try {
            const updateUser = async () => {
                this.logs.setEntity(User);
                await this.validateStatus(id);
                await this.logs.setOld(id, { password: 'Old Password' });
                await this.repository
                    .createQueryBuilder()
                    .update()
                    .set({ password: await this.authService.hashPassword(password) })
                    .where('id = :id', { id })
                    .execute();
                await this.logs.setNew(id, { password: 'New Password' });
                await this.logs.save();
            };

            return this.context.getEntityManager()
                ? await updateUser()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateUser();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('setUserPassword', err);
        }
    }

    async setUserStatus(id: number, status: UserStatus) {
        const updateUser = async () => {
            this.logs.setEntity(User);
            const user = await this.validateStatus(id);
            await this.logs.setOld(id);
            await this.repository
                .createQueryBuilder()
                .update()
                .set({ status })
                .where('id = :id', { id })
                .execute();

            user.status = status;

            await this.logs.setNew(id);
            await this.logs.save();
            return user;
        };

        return this.context.getEntityManager()
            ? await updateUser()
            : await this.repository.manager.transaction(async (manager) => {
                  try {
                      this.context.setEntityManager(manager);
                      return await updateUser();
                  } finally {
                      this.context.releaseEntityManager();
                  }
              });
    }

    private async validateStatus(id: number) {
        const user = await this.findById(id);
        switch (user.status.id) {
            case UserStatus.Active:
                return user;
            case UserStatus.Inactive:
                throw new ForbiddenException('Usuario inactivo');
            case UserStatus.Blocked:
                throw new ForbiddenException('Usuario bloqueado');
            case UserStatus.Deleted:
                throw new ForbiddenException('Usuario no encontrado');
            default:
                throw new InternalServerErrorException('Estado de usuario desconocido.');
        }
    }
}
