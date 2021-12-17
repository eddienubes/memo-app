import { PhraseType } from '../entities/phrase.entity';

export interface IPhraseSearchBody {
  id: number;
  value: string;
  type: PhraseType;
  definition: string;
  owner: number;
}

export interface IPhraseSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: IPhraseSearchBody;
    }>;
  };
}
