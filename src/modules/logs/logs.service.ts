import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from 'src/common/services/utils.service';
import { HistoryLog } from 'src/database/model/entities/history-logs.entity';
import { Repository } from 'typeorm';
import { ContextService } from '../context/context.service';
import { CustomError } from 'src/common/types/CustomError.type';
import { DatabaseOperation } from 'src/common/enums/DatabaseOperation.enum';
import * as equal from 'fast-deep-equal';

@Injectable({ scope: Scope.REQUEST })
export class LogsService extends UtilsService<HistoryLog> {
    private old: Record<string, any> | null = null;
    private new: Record<string, any> | null = null;
    private entityRepository: Repository<any> | null = null;
    private recordId: number | null = null;
    private operation: DatabaseOperation | null = null;

    constructor(
        @InjectRepository(HistoryLog) private readonly _repository: Repository<HistoryLog>,
        private readonly context: ContextService,
    ) {
        super(_repository, 'LogsService');
    }

    private get repository(): Repository<HistoryLog> {
        const manager = this.context.getEntityManager();
        return manager ? manager.getRepository(HistoryLog) : this._repository;
    }

    setEntity(entity: any): void {
        this.hasEntityManager('setEntity');
        this.entityRepository = this.context.getEntityManager().getRepository(entity);
    }

    async setOld(id: number, data?: Record<string, any>): Promise<void> {
        this.hasEntityManager('setOld');
        if (!this.entityRepository && !data) {
            throw new CustomError({
                functionOrMethod: 'LogsService/setOld',
                error: new Error('No se estableció el repositorio de la entidad'),
            });
        }
        if (!this.recordId) this.recordId = id;
        this.old = data ?? (await this.entityRepository.findOneBy({ id })) ?? null;
    }

    async setNew(id: number, data?: Record<string, any>): Promise<void> {
        this.hasEntityManager('setNew');
        if (!this.entityRepository && !data) {
            throw new CustomError({
                functionOrMethod: 'LogsService/setNew',
                error: new Error('No se estableció el repositorio de la entidad'),
            });
        }
        if (!this.recordId) this.recordId = id;
        this.new = data ?? (await this.entityRepository.findOneBy({ id })) ?? null;
    }

    async save(): Promise<void> {
        try {
            if (!this.entityRepository) {
                throw new CustomError({
                    functionOrMethod: 'LogsService/save',
                    error: new Error('EntityRepository no está definido.'),
                });
            }
            if (!this.recordId) {
                throw new CustomError({
                    functionOrMethod: 'LogsService/save',
                    error: new Error('RecordId no está definido.'),
                });
            }

            const oldIsEmpty = !this.old || Object.keys(this.old).length === 0;
            const newIsEmpty = !this.new || Object.keys(this.new).length === 0;

            if (oldIsEmpty && !newIsEmpty) {
                this.operation = DatabaseOperation.Insert;
            } else if (!oldIsEmpty && newIsEmpty) {
                this.operation = DatabaseOperation.Delete;
            } else if (!oldIsEmpty && !newIsEmpty) {
                const { old: oldDiff, new: newDiff } = this.computeDifferences();
                const hasChanges =
                    Object.keys(oldDiff).length > 0 || Object.keys(newDiff).length > 0;

                if (!hasChanges) return;

                this.old = oldDiff;
                this.new = newDiff;
                this.operation = DatabaseOperation.Update;
            } else {
                return;
            }

            const log = new HistoryLog();
            log.action = this.operation;
            log.user = this.context.user;
            log.recordId = this.recordId;
            log.table = this.entityRepository.metadata.name;
            log.details = { old: this.old, new: this.new };

            await this.repository.save(log);
        } catch (err) {
            this.handleError('save', err);
        }
    }

    private hasEntityManager(method: string): void {
        const manager = this.context.getEntityManager();
        if (!manager) {
            throw new CustomError({
                functionOrMethod: `LogsService/${method}`,
                error: new Error('El EntityManager no está definido para registrar logs.'),
            });
        }
    }

    private computeDifferences(): { old: Record<string, any>; new: Record<string, any> } {
        const oldDiff: Record<string, any> = {};
        const newDiff: Record<string, any> = {};

        const allKeys = new Set([...Object.keys(this.old ?? {}), ...Object.keys(this.new ?? {})]);

        for (const key of allKeys) {
            const oldValue = this.old?.[key];
            const newValue = this.new?.[key];

            if (!equal(oldValue, newValue)) {
                if (oldValue !== undefined) oldDiff[key] = oldValue;
                if (newValue !== undefined) newDiff[key] = newValue;
            }
        }

        return { old: oldDiff, new: newDiff };
    }
}
