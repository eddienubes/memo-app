import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { serverConfig, serverConfigSchema } from './common/config/server-config';
import { DATABASE_CONFIG_TOKEN, databaseConfig, databaseConfigSchema } from './common/config/database-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhraseModule } from './phrase/phrase.module';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { authConfig, authConfigSchema } from './auth/config/auth-config';
import { PhraseService } from './example/phrase/phrase.service';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (configService: ConfigType<typeof databaseConfig>) => configService,
    }),
    ConfigModule.forRoot({
      load: [
        serverConfig,
        databaseConfig,
        authConfig
      ],
      validationSchema:
        serverConfigSchema
          .concat(databaseConfigSchema)
          .concat(authConfigSchema)
    }),
    PhraseModule,
    UserModule,
    TestModule,
    AuthModule,
    ExampleModule
  ],
  controllers: [AppController],
  providers: [AppService, PhraseService],
})
export class AppModule {
}
