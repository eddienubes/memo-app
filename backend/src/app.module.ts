import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import serverConfig from './config/server-config';
import databaseConfig from './config/database-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhraseModule } from './phrase/phrase.module';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get<ConfigType<typeof databaseConfig>>('postgres-database'),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      load: [serverConfig, databaseConfig]
    }),
    PhraseModule,
    UserModule,
    TestModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
