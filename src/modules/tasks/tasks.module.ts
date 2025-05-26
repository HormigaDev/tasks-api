import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Priority } from 'src/database/model/entities/priority.entity';
import { TaskStatus } from 'src/database/model/entities/task-status.entity';
import { Task } from 'src/database/model/entities/task.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
    imports: [TypeOrmModule.forFeature([Task, Priority, TaskStatus]), CategoriesModule],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule {}
