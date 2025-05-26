import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { User } from 'src/database/model/entities/user.entity';
import { EntityManager } from 'typeorm';

export const ENTITY_MANAGER_KEY = 'entity_manager';

@Injectable()
export class ContextService {
    private readonly storage = new AsyncLocalStorage<Map<string, any>>();

    runWithContext(fn: () => Promise<any>) {
        const store = new Map<string, any>();
        return this.storage.run(store, fn);
    }

    set(key: string, value: any) {
        const store = this.storage.getStore();
        if (store) {
            store.set(key, value);
        }
    }

    get<T>(key: string): T | undefined {
        return this.storage.getStore()?.get(key);
    }

    get user(): User {
        return this.storage.getStore()?.get('userEntity') as User;
    }

    setEntityManager(em: EntityManager | undefined) {
        this.storage.getStore()?.set(ENTITY_MANAGER_KEY, em);
    }

    getEntityManager(options?: { throwError: boolean }): EntityManager {
        const manager = this.storage.getStore()?.get(ENTITY_MANAGER_KEY) as EntityManager;
        if (!manager && options.throwError) {
            throw new Error('EntityManager no definida');
        }
        return manager;
    }

    releaseEntityManager() {
        this.set(ENTITY_MANAGER_KEY, null);
    }
}
