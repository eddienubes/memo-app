import { Module } from '@nestjs/common';
import { EmailScheduleService } from './services/email-schedule.service';
import { EmailScheduleController } from './email-schedule.controller';

@Module({
  providers: [EmailScheduleService],
  controllers: [EmailScheduleController]
})
export class EmailScheduleModule {}
