import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class EmailScheduleService {

  @Cron('* * * * * *')
  log() {
    console.log('Cron has worked!');
  }
}
