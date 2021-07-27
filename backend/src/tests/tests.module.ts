import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Test } from './entities/test.entity';
import { Choice } from './entities/choice.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Test, Choice])],
  controllers: [TestsController],
  providers: [TestsService]
})
export class TestsModule {}
