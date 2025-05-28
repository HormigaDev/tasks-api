import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/database/model/entities/role.entity';
import { UtilsService } from 'src/common/services/utils.service';
import { CreateRoleDto } from 'src/common/validators/create-role.dto';
import { UpdateRoleDto } from 'src/common/validators/update-role.dto';
import { Repository } from 'typeorm';
import { FindResult } from 'src/common/interfaces/find-result.interface';
import { RoleFindFilters } from './DTOs/role-find-filters.dto';
import { ContextService } from '../context/context.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class RolesService extends UtilsService<Role> {
    constructor(
        @InjectRepository(Role)
        private readonly _repository: Repository<Role>,
        private readonly context: ContextService,
        private readonly logs: LogsService,
    ) {
        super(_repository, 'RolesService');
    }

    private get repository(): Repository<Role> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(Role) : this._repository;
    }

    async findByUser(id: number): Promise<Role[]> {
        try {
            return this.repository
                .createQueryBuilder('role')
                .innerJoin('role.users', 'user')
                .where('user.id = :id', { id })
                .getMany();
        } catch (err) {
            this.handleError('findByUser', err);
        }
    }

    async create(dto: CreateRoleDto): Promise<Role> {
        try {
            const createRole = async () => {
                this.logs.setEntity(Role);
                const role = new Role();
                role.name = dto.name;
                role.permissions = dto.permissions;

                const savedRole = await this.repository.save(role);
                await this.logs.setNew(savedRole.id);
                await this.logs.save();
                return savedRole;
            };
            return this.context.getEntityManager()
                ? await createRole()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await createRole();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('create', err);
        }
    }

    async find(filters: RoleFindFilters): Promise<FindResult<Role>> {
        try {
            let query = this.repository.createQueryBuilder('role');
            query = this.setPagination(query, filters.pagination);
            query = query.orderBy(`role.${filters.orderBy}`, filters.order);
            if (filters.query) {
                query = this.setQueryFilter('role', query, filters.query);
            }

            return await query.getManyAndCount();
        } catch (err) {
            this.handleError('find', err);
        }
    }

    async findOne(id: number): Promise<Role> {
        try {
            const role = await this.repository.findOneBy({ id });
            if (!role) {
                throw new NotFoundException('Role not found');
            }
            return role;
        } catch (err) {
            this.handleError('findOne', err);
        }
    }

    async update(id: number, dto: UpdateRoleDto): Promise<Role> {
        try {
            const updateRole = async () => {
                this.logs.setEntity(Role);
                const role = await this.findOne(id);
                await this.logs.setOld(role.id);
                await this.updateEntity(role.id, dto, this.repository);
                await this.logs.setNew(role.id);
                await this.logs.save();
                return await this.findOne(id);
            };
            return this.context.getEntityManager()
                ? updateRole()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await updateRole();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('update', err);
        }
    }

    async delete(id: number): Promise<Role> {
        try {
            const deleteRole = async () => {
                this.logs.setEntity(Role);
                const role = await this.findOne(id);
                await this.logs.setOld(role.id);
                await this.repository.delete(id);
                await this.logs.save();
                return role;
            };
            return this.context.getEntityManager()
                ? await deleteRole()
                : await this.repository.manager.transaction(async (manager) => {
                      try {
                          this.context.setEntityManager(manager);
                          return await deleteRole();
                      } finally {
                          this.context.releaseEntityManager();
                      }
                  });
        } catch (err) {
            this.handleError('delete', err);
        }
    }
}
