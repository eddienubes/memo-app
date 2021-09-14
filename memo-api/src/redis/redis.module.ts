import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { redisConfig } from '../common/config/redis-config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule.forFeature(redisConfig)],
      inject: [redisConfig.KEY],
      useFactory: async (configService: ConfigType<typeof redisConfig>) => ({
        store: redisStore,
        host: configService.redisHost,
        port: configService.redisPort,
        ttl: 5,
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {

}
