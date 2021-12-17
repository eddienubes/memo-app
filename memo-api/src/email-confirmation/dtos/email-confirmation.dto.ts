import { IsNotEmpty, IsString } from 'class-validator';

export class EmailConfirmationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
