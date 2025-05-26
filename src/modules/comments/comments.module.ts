import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/database/model/entities/comment.entity';
import { CommentsController } from './comments.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Comment])],
    providers: [CommentsService],
    exports: [CommentsService],
    controllers: [CommentsController],
})
export class CommentsModule {}
