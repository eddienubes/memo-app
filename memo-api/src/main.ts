import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import {
  serverConfig,
  SERVER_CONFIG_TOKEN,
} from './common/config/server-config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { MetadataInterceptor } from './common/interceptors/metadata.interceptor';
import { config } from 'aws-sdk';
import { AWS_CONFIG_TOKEN, awsConfig } from './common/config/aws-config';
import { runInCluster } from './utils/run-in-cluster';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new MetadataInterceptor());

  app.use(cookieParser());

  const configService = app.get<ConfigService>(ConfigService);
  const serverConf =
    configService.get<ConfigType<typeof serverConfig>>(SERVER_CONFIG_TOKEN);
  const awsConf =
    configService.get<ConfigType<typeof awsConfig>>(AWS_CONFIG_TOKEN);

  config.update({
    accessKeyId: awsConf.awsAccessKeyId,
    secretAccessKey: awsConf.awsSecretAccessKey,
    region: awsConf.awsRegion,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Memo')
    .setDescription('Memo api description')
    .setVersion('1.0')
    .addTag('Memo')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(serverConf.port);
}

bootstrap();
// runInCluster(bootstrap);
