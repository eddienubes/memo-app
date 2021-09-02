import { Test, TestingModule } from '@nestjs/testing';
import { PhraseSearchService } from '../services/phrase-search.service';

describe('SearchService', () => {
  let service: PhraseSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhraseSearchService],
    }).compile();

    service = module.get<PhraseSearchService>(PhraseSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
