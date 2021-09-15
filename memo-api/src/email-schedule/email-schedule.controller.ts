import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailScheduleService } from './services/email-schedule.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { EmailScheduleRecordDto } from './dtos/email-schedule-record.dto';
import { JwtTwoFactorGuard } from '../auth/guards/jwt-two-factor-guard.service';

@Controller('email-schedule')
export class EmailScheduleController {
  constructor(
    private readonly emailScheduleService: EmailScheduleService
  ) {
  }

  @Post('schedule')
  @UseGuards(JwtTwoFactorGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleRecordDto) {
    this.emailScheduleService.scheduleEmail(emailSchedule);
  }
}
