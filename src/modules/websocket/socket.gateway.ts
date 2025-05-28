import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WsException,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { UsersService } from '../users/users.service';
import { AuthUserWs } from 'src/common/decorators/auth-user-ws.decorator';
import { User } from 'src/database/model/entities/user.entity';
import { ValidatedMessage } from 'src/common/decorators/validated-message.decorator';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/DTOs/create-comment.dto';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { EditCommentDto } from '../comments/DTOs/edit-comment.dto';
import { UseFilters } from '@nestjs/common';
import { WsAllExceptionsFilter } from 'src/common/filters/ws-exception.filter';

@UseFilters(WsAllExceptionsFilter)
@WebSocketGateway({
    path: '/ws',
    transport: ['websocket'],
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly usersService: UsersService,
        private readonly commentsService: CommentsService,
    ) {}

    async handleConnection(client: WebSocket, req: IncomingMessage) {
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim());
        const origin = req.headers.origin;
        if (!allowedOrigins.includes(origin)) {
            client.close();
            return;
        }

        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies['auth_token'];
        if (!token) {
            client.close();
            return;
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET) as any;
            const user = await this.usersService.findById(payload?.userId);
            (client as WebSocket & { user: User }).user = user;
        } catch (err) {
            client.close();
        }
    }

    handleDisconnect(_: WebSocket) {}

    @SubscribeMessage('ping')
    async handlePing(
        @AuthUserWs() user: User,
        @ConnectedSocket() client: WebSocket,
        @MessageBody() _: any,
    ) {
        client.send(JSON.stringify({ event: 'pong', data: { status: 'ok' }, user: user.id }));
    }

    @SubscribeMessage('send_comment')
    @RequirePermissions([Permissions.CreateComments])
    async handleSendComment(
        @AuthUserWs() user: User,
        @ConnectedSocket() client: WebSocket,
        @ValidatedMessage(CreateCommentDto) dto: CreateCommentDto,
    ) {
        await this.commentsService.validateCommentsLimit(user);
        dto.user = user;
        const comment = await this.commentsService.create(dto);

        client.send(JSON.stringify({ event: 'new_comment', data: { comment }, user: user.id }));
    }

    @SubscribeMessage('edit_comment')
    @RequirePermissions([Permissions.UpdateComments])
    async handleEditComment(
        @AuthUserWs() user: User,
        @ConnectedSocket() client: WebSocket,
        @ValidatedMessage(EditCommentDto) dto: EditCommentDto,
    ) {
        dto.user = user;
        const comment = await this.commentsService.edit(dto);

        client.send(JSON.stringify({ event: 'edit_comment', data: { comment }, user: user.id }));
    }

    @SubscribeMessage('delete_comment')
    @RequirePermissions([Permissions.DeleteComments])
    async handleDeleteComment(
        @AuthUserWs() user: User,
        @ConnectedSocket() client: WebSocket,
        @MessageBody() data: any,
    ) {
        const id = Number(data.id);
        if (!id || !Number.isInteger(id) || id < 1) {
            throw new WsException('ID del comentario inválido');
        }

        await this.commentsService.delete(id, user);
        client.send(
            JSON.stringify({
                event: 'delete_comment',
                data: { commentId: id },
                user: user.id,
            }),
        );
    }
}
