import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

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

    getUserId(): number {
        return this.storage.getStore()?.get('userId');
    }

    get userId(): number {
        return this.storage.getStore()?.get('userId');
    }
}
