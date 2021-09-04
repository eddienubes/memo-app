import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import { SERVER_CONFIG_TOKEN, serverConfig } from './common/config/server-config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const sConfig = configService.get<ConfigType<typeof serverConfig>>(SERVER_CONFIG_TOKEN);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: sConfig.port
    }
  });

  await app.startAllMicroservices();
}

bootstrap();
