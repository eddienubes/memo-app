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
import { ExampleModule } from './example/example.module';
import { DefinitionModule } from './definition/definition.module';
import { awsConfig, awsConfigSchema } from './common/config/aws-config';
import { FileModule } from './file/file.module';
import { PrivateFileService } from './file/services/private-file.service';

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
        authConfig,
        awsConfig
      ],
      validationSchema:
        serverConfigSchema
          .concat(databaseConfigSchema)
          .concat(authConfigSchema)
          .concat(awsConfigSchema)
    }),
    PhraseModule,
    UserModule,
    TestModule,
    AuthModule,
    ExampleModule,
    DefinitionModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
