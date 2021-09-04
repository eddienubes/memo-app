import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { serverConfig, serverConfigSchema } from './common/config/server-config';
import { databaseConfig, databaseValidationSchema } from './common/config/database-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriberModule } from './subscriber/subscriber.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        serverConfig,
        databaseConfig,
      ],
      validationSchema:
        serverConfigSchema
          .concat(databaseValidationSchema),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (configService: ConfigType<typeof databaseConfig>) => configService,
    }),
    SubscriberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
