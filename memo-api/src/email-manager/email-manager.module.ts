import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { EmailManagerController } from './email-manager.controller';
import { emailManagerConfig } from './config/email-manager-config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { EmailManagerService } from './services/email-manager.service';
import { EMAIL_MANAGER_TOKEN } from '../utils/constants';

@Module({
  imports: [ConfigModule.forFeature(emailManagerConfig)],
  controllers: [EmailManagerController],
  providers: [
    {
      inject: [emailManagerConfig.KEY],
      provide: EMAIL_MANAGER_TOKEN,
      useFactory: (configService: ConfigType<typeof emailManagerConfig>) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.host,
            port: configService.port,
          },
        });
      },
    },
    EmailManagerService,
  ],
  exports: [EMAIL_MANAGER_TOKEN],
})
export class EmailManagerModule {}
