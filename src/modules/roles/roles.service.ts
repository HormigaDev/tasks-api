import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/database/model/entities/role.entity';
import { UtilsService } from 'src/common/services/utils.service';
import { CreateRoleDto } from 'src/common/validators/create-role.dto';
import { UpdateRoleDto } from 'src/common/validators/update-role.dto';
import { Repository } from 'typeorm';
import { FindResult } from 'src/common/interfaces/find-result.interface';
import { RoleFindFilters } from './DTOs/role-find-filters.dto';

@Injectable()
export class RolesService extends UtilsService<Role> {
    constructor(
        @InjectRepository(Role)
        private readonly repository: Repository<Role>,
    ) {
        super(repository, 'RolesService');
    }

    async findByUser(id: number): Promise<Role[]> {
        try {
            return this.repository
                .createQueryBuilder('role')
                .innerJoin('role.users', 'user')
                .where('user.id = :id', { id })
                .getMany();
        } catch (error) {
            this.handleError('findByUser', error);
        }
    }

    async create(dto: CreateRoleDto): Promise<Role> {
        try {
            const role = new Role();
            role.name = dto.name;
            role.permissions = dto.permissions;

            return await this.repository.save(role);
        } catch (error) {
            this.handleError('create', error);
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
        } catch (error) {
            this.handleError('findOne', error);
        }
    }

    async update(id: number, dto: UpdateRoleDto): Promise<Role> {
        try {
            const role = await this.findOne(id);
            await this.updateEntity(role.id, dto);
            return await this.findOne(id);
        } catch (error) {
            this.handleError('update', error);
        }
    }

    async delete(id: number): Promise<Role> {
        try {
            const role = await this.findOne(id);
            await this.repository.delete({ id });
            return role;
        } catch (error) {
            this.handleError('delete', error);
        }
    }
}
