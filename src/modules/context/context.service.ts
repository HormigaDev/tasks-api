import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { User } from 'src/database/model/entities/user.entity';

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
}
