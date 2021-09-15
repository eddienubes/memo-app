import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class EmailScheduleRecordDto {
  @IsEmail()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  date: string;
}

