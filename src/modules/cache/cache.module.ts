import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: 'localhost',
            port: 6379,
            ttl: 900,
        }),
    ],
    exports: [CacheModule],
})
export class CacheProviderModule {}
