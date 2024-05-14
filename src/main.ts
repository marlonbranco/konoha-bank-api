import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';


async function bootstrap () {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { cors: true }
    );

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Konoha Banking Api 🍃')
        .setDescription('The banking API for simple and safe transactions')
        .setVersion('1.0')
        .addTag('accounts')
        .addTag('transactions')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.log(`Banking API is running on: ${await app.getUrl()}`);
}
bootstrap();


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch (exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception instanceof HttpException ? exception.getStatus() : 500;
        response.status(status).json({
            statusCode: status,
            message: 'Internal server error',
        });
    }
}