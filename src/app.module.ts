import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './common/auth/jwt.strategy';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { CacheProviderModule } from './modules/cache/cache.module';

dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: false,
            autoLoadEntities: true,
            entities: [__dirname + '/common/models/*.entity{.ts,.js}'],
        }),
        CacheProviderModule,
        UsersModule,
        AuthModule,
        RolesModule,
    ],
    controllers: [AppController],
    providers: [AppService, JwtStrategy, JwtAuthGuard],
})
export class AppModule {}
