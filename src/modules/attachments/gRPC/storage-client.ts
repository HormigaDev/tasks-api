import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
    DeleteFileRequest,
    DeleteFileResponse,
    GetFileRequest,
    GetFileResponse,
    SaveFileRequest,
    SaveFileResponse,
} from './proto/storage';
import { Observable } from 'rxjs';

export const STORAGE_CLIENT_TOKEN = 'STORAGE_PACKAGE';

export interface StorageServiceGrpcClient {
    SaveFile(data: SaveFileRequest): Observable<SaveFileResponse>;
    GetFile(data: GetFileRequest): Observable<GetFileResponse>;
    DeleteFile(data: DeleteFileRequest): Observable<DeleteFileResponse>;
}

@Injectable()
export class StorageGrpcService implements OnModuleInit {
    private storageService!: StorageServiceGrpcClient;

    constructor(
        @Inject(STORAGE_CLIENT_TOKEN)
        private readonly client: ClientGrpc,
    ) {}

    async onModuleInit() {
        this.storageService = this.client.getService<StorageServiceGrpcClient>('StorageService');
    }

    saveFile(data: SaveFileRequest) {
        return this.storageService.SaveFile(data);
    }

    getFile(data: GetFileRequest) {
        return this.storageService.GetFile(data);
    }

    deleteFile(data: DeleteFileRequest) {
        return this.storageService.DeleteFile(data);
    }
}
