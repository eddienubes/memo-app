import { Injectable } from '@nestjs/common';
import { EmailScheduleRecordDto } from '../dtos/email-schedule-record.dto';
import { CronJob } from 'cron';
import { EmailService } from '../../email/services/email.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class EmailScheduleService {
  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
  }

  scheduleEmail(emailScheduleDto: EmailScheduleRecordDto) {
    const date = new Date(emailScheduleDto.date);

    const job = new CronJob(date, async () => {
      await this.emailService.sendMail({
        to: emailScheduleDto.recipient,
        subject: emailScheduleDto.subject,
        text: emailScheduleDto.content
      });
    });

    this.schedulerRegistry.addCronJob(`${Date.now()}-${emailScheduleDto.subject}`, job);

    job.start();
  }
}
