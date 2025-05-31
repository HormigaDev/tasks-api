import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from 'src/database/model/entities/attachment.entity';
import { AttachmentsController } from './attachments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { STORAGE_CLIENT_TOKEN, StorageGrpcService } from './gRPC/storage-client';
import { join } from 'path';

@Module({
    imports: [
        TypeOrmModule.forFeature([Attachment]),
        ClientsModule.register([
            {
                name: STORAGE_CLIENT_TOKEN,
                transport: Transport.GRPC,
                options: {
                    package: 'storage',
                    protoPath: join(__dirname, 'gRPC/proto/storage.proto'),
                    url: process.env.STORAGE_GRPC_URL,
                },
            },
        ]),
    ],
    providers: [AttachmentsService, StorageGrpcService],
    exports: [AttachmentsService, StorageGrpcService],
    controllers: [AttachmentsController],
})
export class AttachmentsModule {}
