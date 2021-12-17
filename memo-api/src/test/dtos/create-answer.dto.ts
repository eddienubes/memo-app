import { IsString, ValidateNested } from 'class-validator';
import { Test } from '../entities/test.entity';
import { Type } from 'class-transformer';

export class CreateAnswerDto {
  @IsString()
  definition: string;

  @ValidateNested()
  @Type(() => Test)
  test?: Test;

  valid?: boolean;
}
