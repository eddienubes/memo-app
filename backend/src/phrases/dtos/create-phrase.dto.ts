import { IsArray, IsEmpty, IsEnum, IsString, Length, MaxLength } from 'class-validator'
import { PhraseType } from '../entities/phrase.entity';

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

  @IsEnum(PhraseType, {
    message: `type field can only contain these values: ${Object.values(PhraseType)}`
  })
  type: PhraseType
}