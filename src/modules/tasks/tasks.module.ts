import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/database/model/entities/task.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
    imports: [TypeOrmModule.forFeature([Task]), CategoriesModule],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule {}
