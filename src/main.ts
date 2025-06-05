import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: false,
        }),
    );

    if (process.env.NODE_ENV === 'development') {
        const documentConfig = new DocumentBuilder()
            .setTitle('MYRMEKIA Tasks API')
            .setDescription('Una API de tareas TODO')
            .setVersion('1.0.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    description: 'Ingrese el token JWT en el formato: Bearer {token}',
                    in: 'header',
                },
                'jwt-auth',
            )
            .build();

        const document = SwaggerModule.createDocument(app, documentConfig);

        SwaggerModule.setup('docs', app, document);
    }

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
