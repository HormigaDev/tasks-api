import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';

const logsDir = path.join(process.cwd(), 'logs');

// Crear la carpeta logs si no existe
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

export const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [],
});

// Función para crear un archivo con nombre dinámico por error
export function logErrorToFile(error: Error, context?: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `error-${timestamp}.log`;

    const fileTransport = new winston.transports.File({
        filename: path.join(logsDir, filename),
    });

    errorLogger.clear(); // Limpiar transportes anteriores
    errorLogger.add(fileTransport);

    errorLogger.error({
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        context: context || 'Unknown',
        timestamp: new Date().toISOString(),
    });

    errorLogger.remove(fileTransport);
}
