import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './services/log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
