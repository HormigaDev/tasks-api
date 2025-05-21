import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { CommentsModule } from '../comments/comments.module';

@Module({
    imports: [CommentsModule],
    providers: [SocketGateway],
})
export class SocketModule {}
