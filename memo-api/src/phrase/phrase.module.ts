import { CacheModule, Module } from '@nestjs/common';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './services/phrase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phrase } from './entities/phrase.entity';
import { ExampleModule } from '../example/example.module';
import { DefinitionModule } from '../definition/definition.module';
import { PhraseSearchService } from './services/phrase-search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5, // duration one item is stored in cache
      max: 100 // maximum amount of items stored in cache
    }),
    TypeOrmModule.forFeature([Phrase]),
    ExampleModule,
    DefinitionModule,
    SearchModule
  ],
  controllers: [PhraseController],
  providers: [PhraseService, PhraseSearchService],
  exports: [PhraseService]
})
export class PhraseModule {
}
