import { BadRequestException, HttpException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CustomError } from '../types/CustomError.type';
import { PaginationInterface } from '../interfaces/pagination.interface';
import { PropertySearch } from '../interfaces/property-search.interface';
import { SearchOperators } from '../enums/SearchOperators.enum';

export class UtilsService<Entity> {
    private repo: Repository<Entity>;
    protected className: string;

    constructor(repository: Repository<Entity>, className: string = '') {
        this.repo = repository;
        this.className = className;
    }

    protected async updateEntity<UpdateEntityDto>(
        id: number,
        dto: UpdateEntityDto,
        repository: Repository<Entity> = null,
    ) {
        const props: Record<string, any> = {};
        for (const key of Object.keys(dto)) {
            if (dto[key] !== undefined) {
                props[key] = dto[key];
            }
        }

        if (Object.keys(props).length === 0) {
            throw new BadRequestException('Ningún dato informado para actualizar');
        }

        const repo = repository || this.repo;

        await repo.createQueryBuilder().update().set(props).where('id = :id', { id }).execute();
    }

    protected setPagination(query: SelectQueryBuilder<Entity>, pagination: PaginationInterface) {
        return query.take(pagination.limit).skip(pagination.limit * (pagination.page - 1));
    }

    protected setQueryFilter(
        alias: string,
        query: SelectQueryBuilder<Entity>,
        { key, operator, value, valueEnd }: PropertySearch,
    ) {
        let sql = `${alias}.${key}`;

        switch (operator) {
            case SearchOperators.Between:
                if (!valueEnd) {
                    throw new BadRequestException(
                        'Cuando seleccionado el operador "ENTRE" el valor final debe ser informado',
                    );
                }
                sql = `${sql} >= :value and ${sql} <= :valueEnd`;
                break;
            case SearchOperators.Contain:
                sql += ' ilike :value';
                break;
            default:
                sql += ` ${operator} :value`;
                break;
        }

        query = query.andWhere(sql, {
            value: operator === SearchOperators.Contain ? `%${value}%` : value,
            valueEnd,
        });

        return query;
    }

    protected handleError(func: string, error: any) {
        if (error instanceof HttpException) {
            throw error;
        } else {
            throw new CustomError({ functionOrMethod: `${this.className}/${func}`, error });
        }
    }
}
