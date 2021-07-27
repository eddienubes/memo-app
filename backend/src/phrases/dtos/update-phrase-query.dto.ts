import { IsNumberString, IsPositive } from 'class-validator';

export class UpdatePhraseQueryDto {
  @IsPositive()
  id: number;
}