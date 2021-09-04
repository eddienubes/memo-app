import { Test, TestingModule } from '@nestjs/testing';
import { EmailManagerService } from '../services/email-manager.service';

describe('EmailServiceService', () => {
  let service: EmailManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailManagerService],
    }).compile();

    service = module.get<EmailManagerService>(EmailManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
