import { Test, TestingModule } from '@nestjs/testing';
import { PublicFileService } from '../services/public-file.service';

describe('PublicFileService', () => {
  let service: PublicFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicFileService],
    }).compile();

    service = module.get<PublicFileService>(PublicFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
