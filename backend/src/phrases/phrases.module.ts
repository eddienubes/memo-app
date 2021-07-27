import { Module } from '@nestjs/common';
import { PhrasesController } from './phrases.controller';
import { PhrasesService } from './phrases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from './entities/example.entity';
import { Phrase } from './entities/phrase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Example, Phrase])
  ],
  controllers: [PhrasesController],
  providers: [PhrasesService]
})
export class PhrasesModule {}
