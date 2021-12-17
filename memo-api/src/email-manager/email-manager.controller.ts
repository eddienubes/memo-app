import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { ClientProxy } from '@nestjs/microservices';
import { EMAIL_MANAGER_TOKEN } from '../utils/constants';

@Controller('email-manager')
export class EmailManagerController {
  constructor(
    @Inject(EMAIL_MANAGER_TOKEN)
    private readonly subscriberService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  public async getSubscribers() {
    return this.subscriberService.send(
      {
        cmd: 'get-all-subscribers',
      },
      '',
    );
  }
}
