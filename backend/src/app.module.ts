import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import serverConfig from './config/server-config';
import databaseConfig from './config/database-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhrasesModule } from './phrases/phrases.module';
import { UsersModule } from './users/users.module';
import { TestsModule } from './tests/tests.module';

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
    PhrasesModule,
    UsersModule,
    TestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
