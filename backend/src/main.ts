import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import { serverConfig, SERVER_CONFIG_TOKEN } from './common/config/server-config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { MetadataInterceptor } from './common/interceptors/metadata.interceptor';
import { config } from 'aws-sdk';
import { AWS_CONFIG_TOKEN, awsConfig } from './common/config/aws-config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(new MetadataInterceptor());

  app.use(cookieParser());

  const configService = app.get<ConfigService>(ConfigService);
  const serverConf = configService.get<ConfigType<typeof serverConfig>>(SERVER_CONFIG_TOKEN);
  const awsConf = configService.get<ConfigType<typeof awsConfig>>(AWS_CONFIG_TOKEN);

  config.update({
    accessKeyId: awsConf.awsAccessKeyId,
    secretAccessKey: awsConf.awsSecretAccessKey,
    region: awsConf.awsRegion
  });

  await app.listen(serverConf.port);
}

bootstrap();
