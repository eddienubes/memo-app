import { Phrase, PhraseType } from '../../phrase/entities/phrase.entity';
import { IsEnum } from 'class-validator';

export class CreateTestQueryDto {
  @IsEnum(PhraseType)
  type: PhraseType;
}
