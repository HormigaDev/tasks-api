import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { CustomError } from '../types/CustomError.type';
import { PaginationInterface } from '../interfaces/pagination.interface';
import { PropertySearch } from '../interfaces/property-search.interface';
import { SearchOperators } from '../enums/SearchOperators.enum';
import { User } from 'src/database/model/entities/user.entity';
import { ContextService } from 'src/modules/context/context.service';

@Injectable()
export class UtilsService<Entity> {
    private repo: Repository<Entity>;
    protected className: string;
    private ctx: ContextService;

    constructor(
        repository: Repository<Entity>,
        className: string = '',
        context: ContextService = null,
    ) {
        this.repo = repository;
        this.className = className;
        this.ctx = context;
    }

    protected async updateEntity<UpdateEntityDto>(id: number, dto: UpdateEntityDto) {
        const props: Record<string, any> = {};
        for (const key in Object.keys(dto)) {
            if (dto[key] !== undefined) {
                props[key] = dto[key];
            }
        }

        if (Object.keys(props).length === 0) {
            throw new BadRequestException('Ningún dato informado para actualizar');
        }

        await this.repo
            .createQueryBuilder()
            .update()
            .set(props)
            .where('id = :id', { id })
            .execute();
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

    protected get user(): User {
        if (!this.ctx) {
            throw new CustomError({
                functionOrMethod: `${this.className}/getUser (dentro de la clase UtilsService)`,
                error: 'El contexto no está disponible',
            });
        }
        const user = new User();
        user.id = this.ctx.userId;
        return user;
    }

    protected handleError(func: string, error: any) {
        if (error instanceof HttpException) {
            throw error;
        } else {
            throw new CustomError({ functionOrMethod: `${this.className}/${func}`, error });
        }
    }
}
