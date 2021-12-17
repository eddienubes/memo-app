import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  username: string;

  @MinLength(6)
  @IsString()
  password: string;
}
