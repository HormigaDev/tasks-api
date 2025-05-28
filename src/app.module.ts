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
import { CategoriesModule } from './modules/categories/categories.module';
import { ContextModule } from './modules/context/context.module';
import { TagsModule } from './modules/tags/tags.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { SocketModule } from './modules/websocket/socket.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SubtasksModule } from './modules/subtasks/subtasks.module';
import { LogsModule } from './modules/logs/logs.module';

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
            entities: [__dirname + '/database/model/entities/*.entity{.ts,.js}'],
        }),
        CacheProviderModule,
        UsersModule,
        AuthModule,
        RolesModule,
        CategoriesModule,
        ContextModule,
        TagsModule,
        MilestonesModule,
        SocketModule,
        CommentsModule,
        AttachmentsModule,
        TasksModule,
        SubtasksModule,
        LogsModule,
    ],
    controllers: [AppController],
    providers: [AppService, JwtStrategy, JwtAuthGuard],
})
export class AppModule {}
