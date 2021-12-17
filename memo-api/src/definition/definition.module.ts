import { Module } from '@nestjs/common';
import { DefinitionController } from './definition.controller';
import { DefinitionService } from './services/definition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from './entities/definition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Definition])],
  controllers: [DefinitionController],
  providers: [DefinitionService],
  exports: [DefinitionService],
})
export class DefinitionModule {}
