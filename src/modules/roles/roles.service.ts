import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInterface } from 'src/common/interfaces/pagination.interface';
import { ServiceInterface } from 'src/common/interfaces/service.interface';
import { Role } from 'src/database/entities/role.entity';
import { UtilsService } from 'src/common/services/utils.service';
import { CreateRoleDto } from 'src/common/validators/create-role.dto';
import { UpdateRoleDto } from 'src/common/validators/update-role.dto';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService
    extends UtilsService<Role, UpdateRoleDto>
    implements ServiceInterface<Role, CreateRoleDto, UpdateRoleDto>
{
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {
        super(roleRepository, 'RolesService');
    }

    async findByUser(id: number): Promise<Role[]> {
        try {
            return this.roleRepository
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

            return await this.roleRepository.save(role);
        } catch (error) {
            this.handleError('create', error);
        }
    }

    async findAll(pagination: PaginationInterface): Promise<Role[]> {
        try {
            return await this.roleRepository
                .createQueryBuilder()
                .skip(this.page(pagination))
                .take(pagination.limit)
                .getMany();
        } catch (error) {
            this.handleError('findAll', error);
        }
    }

    async findRoles(userId: number, pagination: PaginationInterface): Promise<Role[]> {
        try {
            return await this.roleRepository
                .createQueryBuilder('role')
                .where((qb) => {
                    const subQuery = qb
                        .subQuery()
                        .select('1')
                        .from('user_roles', 'ur')
                        .innerJoin('roles', 'r', 'r.id = ur.role_id')
                        .where('ur.user_id = :userId', { userId })
                        .andWhere('(role.permissions & r.permissions) = role.permissions') // Verifica si el rol está contenido
                        .getQuery();

                    return `EXISTS (${subQuery})`;
                })
                .skip(this.page(pagination))
                .take(pagination.limit)
                .getMany();
        } catch (error) {
            this.handleError('findRoles', error);
        }
    }

    async findOne(id: number): Promise<Role> {
        try {
            const role = await this.roleRepository.findOneBy({ id });
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
            await this.roleRepository.delete({ id });
            return role;
        } catch (error) {
            this.handleError('delete', error);
        }
    }
}
