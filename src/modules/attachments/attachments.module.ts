import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from 'src/database/model/entities/attachment.entity';
import { AttachmentsController } from './attachments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { STORAGE_CLIENT_TOKEN } from './gRPC/storage-client';

@Module({
    imports: [
        TypeOrmModule.forFeature([Attachment]),
        ClientsModule.register([
            {
                name: STORAGE_CLIENT_TOKEN,
                transport: Transport.GRPC,
                options: {
                    package: 'storage',
                    protoPath: join(__dirname, './gRPC/proto/storage.proto'),
                    url: process.env.STORAGE_GRPC_URL || 'localhost:50051',
                },
            },
        ]),
    ],
    providers: [AttachmentsService],
    exports: [AttachmentsService],
    controllers: [AttachmentsController],
})
export class AttachmentsModule {}
