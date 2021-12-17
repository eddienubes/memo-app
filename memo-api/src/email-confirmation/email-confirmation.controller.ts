import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationDto } from './dtos/email-confirmation.dto';
import { JwtTwoFactorGuard } from '../auth/guards/jwt-two-factor-guard.service';
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirm')
  public async confirm(@Body() { token }: EmailConfirmationDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-email')
  @UseGuards(JwtTwoFactorGuard)
  public async resendConfirmationEmail(@Req() req: IRequestWithUser) {
    await this.emailConfirmationService.resendConfirmationLink(req.user.id);
  }
}
