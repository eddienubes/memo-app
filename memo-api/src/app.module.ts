import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { serverConfig, serverConfigSchema } from './common/config/server-config';
import { databaseConfig, databaseConfigSchema } from './common/config/database-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhraseModule } from './phrase/phrase.module';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { authConfig, authConfigSchema } from './common/config/auth-config';
import { ExampleModule } from './example/example.module';
import { DefinitionModule } from './definition/definition.module';
import { awsConfig, awsConfigSchema } from './common/config/aws-config';
import { FileModule } from './file/file.module';
import { elasticConfig, elasticConfigSchema } from './common/config/elastic-config';
import { SearchModule } from './search/search.module';
import { emailManagerConfig, emailManagerValidationSchema } from './email-manager/config/email-manager-config';
import { EmailManagerModule } from './email-manager/email-manager.module';
import { googleAuthConfig, googleAuthValidationSchema } from './common/config/google-auth-config';
import { redisConfig, redisConfigValidationSchema } from './common/config/redis-config';
import { RedisModule } from './redis/redis.module';
import { emailConfig, emailConfigValidationSchema } from './common/config/email-config';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailScheduleModule } from './email-schedule/email-schedule.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';

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
        awsConfig,
        elasticConfig,
        emailManagerConfig,
        googleAuthConfig,
        redisConfig,
        emailConfig
      ],
      validationSchema:
        serverConfigSchema
          .concat(databaseConfigSchema)
          .concat(authConfigSchema)
          .concat(awsConfigSchema)
          .concat(elasticConfigSchema)
          .concat(emailManagerValidationSchema)
          .concat(googleAuthValidationSchema)
          .concat(redisConfigValidationSchema)
          .concat(emailConfigValidationSchema)
    }),
    PhraseModule,
    UserModule,
    TestModule,
    AuthModule,
    ExampleModule,
    DefinitionModule,
    FileModule,
    SearchModule,
    EmailManagerModule,
    RedisModule,
    EmailModule,
    ScheduleModule.forRoot(),
    EmailScheduleModule,
    EmailConfirmationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
