import { BadRequestException, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomError } from '../types/CustomError.type';
import { PaginationInterface } from '../interfaces/pagination.interface';

export class UtilsService<T, T2> {
    private repository: Repository<T>;
    protected className: string;
    constructor(repository: Repository<T>, className: string = '') {
        this.repository = repository;
        this.className = className;
    }
    protected async updateEntity(id: number, dto: T2) {
        const props: Record<string, any> = {};
        for (const key in Object.keys(dto)) {
            if (dto[key] !== undefined) {
                props[key] = dto[key];
            }
        }

        if (Object.keys(props).length === 0) {
            throw new BadRequestException('No data to update');
        }

        await this.repository
            .createQueryBuilder()
            .update()
            .set(props)
            .where('id = :id', { id })
            .execute();
    }

    protected page(pagination: PaginationInterface): number {
        return pagination.limit * (pagination.page - 1);
    }

    protected handleError(func: string, error: any) {
        if (error instanceof HttpException) {
            throw error;
        } else {
            throw new CustomError({ functionOrMethod: `${this.className}/${func}`, error });
        }
    }
}
