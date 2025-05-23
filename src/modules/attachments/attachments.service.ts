import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from 'src/common/services/utils.service';
import { Attachment } from 'src/database/model/entities/attachment.entity';
import { Repository } from 'typeorm';
import { ContextService } from '../context/context.service';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_CLIENT_TOKEN, StorageGrpcService } from './gRPC/storage-client';
import { firstValueFrom } from 'rxjs';
import { GetFileResponse, SaveFileResponse } from './gRPC/proto/storage';

@Injectable()
export class AttachmentsService extends UtilsService<Attachment> {
    constructor(
        @InjectRepository(Attachment) private readonly repository: Repository<Attachment>,
        private readonly context: ContextService,
        @Inject(STORAGE_CLIENT_TOKEN)
        private readonly gRPC: StorageGrpcService,
    ) {
        super(repository, 'AttachmentsService');
    }

    async save(file: Express.Multer.File): Promise<Attachment> {
        try {
            const user = this.context.user;
            const fileExtension = extname(file.originalname);
            let uuid: string;
            do {
                uuid = uuidv4();
            } while (await this.repository.exists({ where: { name: uuid, user } }));

            const filename = `${uuid}${fileExtension}`;

            const response: SaveFileResponse = await firstValueFrom(
                this.gRPC.saveFile({ userId: `${user.id}`, filename, fileContent: file.buffer }),
            );

            if (!response.success) {
                throw new InternalServerErrorException(
                    'Ocurrió un error inesperado al guardar el archivo',
                );
            }

            const attachment = new Attachment();
            attachment.user = user;
            attachment.name = uuid;
            attachment.type = fileExtension;
            attachment.url = `/attachments/download/${uuid}`;

            return await this.repository.save(attachment);
        } catch (err) {
            this.handleError('save', err);
        }
    }

    async saveMultiple(files: Express.Multer.File[]): Promise<[Attachment[], string[]]> {
        try {
            const user = this.context.user;
            const attachments: Attachment[] = [];
            const errors: string[] = [];

            for (const file of files) {
                const fileExtension = extname(file.originalname);
                let uuid: string;
                do {
                    uuid = uuidv4();
                } while (await this.repository.exists({ where: { name: uuid, user } }));

                const filename = `${uuid}${fileExtension}`;

                const response: SaveFileResponse = await firstValueFrom(
                    this.gRPC.saveFile({
                        userId: `${user.id}`,
                        filename,
                        fileContent: file.buffer,
                    }),
                );

                if (!response.success) {
                    errors.push(file.originalname);
                    continue;
                }

                const attachment = new Attachment();
                attachment.user = user;
                attachment.name = uuid;
                attachment.type = fileExtension;
                attachment.url = `/attachments/download/${uuid}`;

                attachments.push(await this.repository.save(attachment));
            }
            return [attachments, errors];
        } catch (err) {
            this.handleError('saveMultiple', err);
        }
    }

    async findByName(name: string): Promise<Attachment> {
        try {
            const attachment = await this.repository.findOneBy({ name, user: this.context.user });
            if (!attachment) {
                throw new NotFoundException('Archivo no encontrado');
            }

            return attachment;
        } catch (err) {
            this.handleError('findByName', err);
        }
    }

    async findById(id: number): Promise<Attachment> {
        try {
            const attachment = await this.repository.findOneBy({ id, user: this.context.user });
            if (!attachment) {
                throw new NotFoundException('Archivo no encontrado');
            }

            return attachment;
        } catch (err) {
            this.handleError('findById', err);
        }
    }

    async read(name: string): Promise<Attachment> {
        try {
            const attachment = await this.findByName(name);
            const response: GetFileResponse = await firstValueFrom(
                this.gRPC.getFile({
                    userId: `${this.context.user.id}`,
                    filename: `${attachment.name}${attachment.type}`,
                }),
            );

            if (!response.success) {
                throw new NotFoundException('Archivo no encontrado');
            }

            attachment.setBuffer(Buffer.from(response.fileContent));
            return attachment;
        } catch (err) {
            this.handleError('read', err);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const attachment = await this.findById(id);
            const response = await firstValueFrom(
                this.gRPC.deleteFile({
                    userId: `${this.context.user.id}`,
                    filename: `${attachment.name}${attachment.type}`,
                }),
            );

            if (!response.success) {
                throw new InternalServerErrorException('Error al eliminar el archivo');
            }

            await this.repository.delete(attachment.id);
        } catch (err) {
            this.handleError('delete', err);
        }
    }
}
