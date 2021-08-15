import { Module } from '@nestjs/common';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from './entities/example.entity';
import { Phrase } from './entities/phrase.entity';
import { Definition } from './entities/definition.entity';
import { ExampleService } from './example.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Example, Phrase, Definition])
  ],
  controllers: [PhraseController],
  providers: [PhraseService, ExampleService],
  exports: [PhraseService]
})
export class PhraseModule {
}