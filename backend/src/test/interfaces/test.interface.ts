import { PhraseType } from '../../phrase/entities/phrase.entity';

class PhraseData {
  id: number;
  value: string;
  type: PhraseType;
}

class AnswerData {
  id: number;
  definition: string;
}

export class TestRO {
  id: number;
  phrase: PhraseData;
  answers: AnswerData[];
}