import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './services/search.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { elasticConfig } from '../common/config/elastic-config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ConfigModule.forFeature(elasticConfig),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule.forFeature(elasticConfig)],
      inject: [elasticConfig.KEY],
      useFactory: async (configService: ConfigType<typeof elasticConfig>) => ({
        node: configService.elasticSearchNode,
        auth: {
          username: configService.elasticSearchUsername,
          password: configService.elasticSearchUsername,
        },
      }),
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
