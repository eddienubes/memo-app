import { Test, TestingModule } from '@nestjs/testing';
import { EmailManagerController } from '../email-manager.controller';

describe('EmailServiceController', () => {
  let controller: EmailManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailManagerController],
    }).compile();

    controller = module.get<EmailManagerController>(EmailManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
