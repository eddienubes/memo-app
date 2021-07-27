import { IsNumberString, IsOptional, IsPositive } from 'class-validator';


export class RemovePhraseDto {
  @IsPositive()
  id: number;
}