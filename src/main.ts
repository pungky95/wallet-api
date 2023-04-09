import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: true,
      exceptionFactory: (errors) => {
        throw new HttpException(
          { status: 'fail', data: errors },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('Wallet API')
    .setDescription('Description of Wallet API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // Use multer to handle form data
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(upload.any());
  await app.listen(config.PORT);
}
bootstrap();
