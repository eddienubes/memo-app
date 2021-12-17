import { IsString, MaxLength } from 'class-validator';

export class CreateExampleDto {
  @MaxLength(2000)
  @IsString()
  example: string;
}
