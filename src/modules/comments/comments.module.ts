import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/database/model/entities/comment.entity';
import { Task } from 'src/database/model/entities/task.entity';
import { Subtask } from 'src/database/model/entities/subtask.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Task, Subtask])],
    providers: [CommentsService],
    exports: [CommentsService],
})
export class CommentsModule {}
