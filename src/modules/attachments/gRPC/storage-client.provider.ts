import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const STORAGE_PACKAGE_NAME = 'storage';
export const STORAGE_SERVICE_NAME = 'StorageService';

export const storageGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        package: STORAGE_PACKAGE_NAME,
        protoPath: join(
            __dirname,
            './proto/storage.proto', // Ajusta la ruta según la ubicación real del proto
        ),
        url: process.env.STORAGE_GRPC_URL || 'localhost:50051', // Definible por ENV
        loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        },
    },
};
