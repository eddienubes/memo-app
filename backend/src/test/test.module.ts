import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Test } from './entities/test.entity';
import { Choice } from './entities/choice.entitiy';
import { PhraseModule } from '../phrase/phrase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Test, Choice]),
    PhraseModule
  ],
  controllers: [TestController],
  providers: [TestService]
})
export class TestModule {}
