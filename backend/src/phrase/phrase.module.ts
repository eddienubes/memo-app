import { Module } from '@nestjs/common';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './services/phrase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phrase } from './entities/phrase.entity';
import { ExampleModule } from '../example/example.module';
import { DefinitionModule } from '../definition/definition.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Phrase]),
    ExampleModule,
    DefinitionModule
  ],
  controllers: [PhraseController],
  providers: [PhraseService],
  exports: [PhraseService]
})
export class PhraseModule {
}
