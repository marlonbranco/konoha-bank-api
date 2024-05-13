import { NestFactory } from '@nestjs/core';
import {
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap () {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule
    );


    const config = new DocumentBuilder()
        .setTitle('Banking Api example')
        .setDescription('The banking API for simple transactions')
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