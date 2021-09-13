import { IsNumberString, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';


export class RemovePhraseDto {
  @IsPositive()
  @Type(() => Number)
  id: number;
}