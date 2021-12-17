import { IsString, MaxLength } from 'class-validator';

export class UpdateExampleDto {
  @MaxLength(2000)
  @IsString()
  example: string;
}
