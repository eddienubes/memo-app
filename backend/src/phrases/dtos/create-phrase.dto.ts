import { IsArray, IsEmpty, IsString, Length, MaxLength } from 'class-validator'

export class CreatePhraseDto {
  @Length(1, 1000)
  @IsString()
  phrase: string;

  @Length(1, 1000)
  @IsString()
  definition: string;

  @MaxLength(2000, {
    each: true
  })
  @IsString({ each: true })
  @IsArray()
  examples: string[];
}