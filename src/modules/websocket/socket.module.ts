import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { CommentsModule } from '../comments/comments.module';
import { WsAllExceptionsFilter } from 'src/common/filters/ws-exception.filter';

@Module({
    imports: [CommentsModule],
    providers: [SocketGateway, WsAllExceptionsFilter],
})
export class SocketModule {}
