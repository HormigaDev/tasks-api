import { Module } from '@nestjs/common';
import { SubtasksController } from './subtasks.controller';
import { SubtasksService } from './subtasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subtask } from 'src/database/model/entities/subtask.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
    imports: [TypeOrmModule.forFeature([Subtask]), TasksModule],
    controllers: [SubtasksController],
    providers: [SubtasksService],
    exports: [SubtasksService],
})
export class SubtasksModule {}
