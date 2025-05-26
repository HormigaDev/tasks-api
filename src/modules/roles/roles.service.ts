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

@Injectable()
export class RolesService extends UtilsService<Role> {
    constructor(
        @InjectRepository(Role)
        private readonly _repository: Repository<Role>,
        private readonly context: ContextService,
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
            const role = new Role();
            role.name = dto.name;
            role.permissions = dto.permissions;

            return await this.repository.save(role);
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
            const role = await this.findOne(id);
            await this.updateEntity(role.id, dto);
            return await this.findOne(id);
        } catch (err) {
            this.handleError('update', err);
        }
    }

    async delete(id: number): Promise<Role> {
        try {
            const role = await this.findOne(id);
            await this.repository.delete({ id });
            return role;
        } catch (err) {
            this.handleError('delete', err);
        }
    }
}
