import { OmitType } from '@nestjs/swagger';
import { CreatePhraseDto } from './create-phrase.dto';

export class UpdatePhraseDto extends OmitType(CreatePhraseDto, ['examples'] as const) {
  examples: string[];
}