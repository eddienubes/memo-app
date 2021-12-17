import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { authConfig } from '../common/config/auth-config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/services/email.service';
import { IVerificationTokenPayload } from './interfaces/verification-token-payload.interface';
import { UserService } from '../user/services/user.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfigService: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  public async sendVerificationLink(email: string) {
    const payload: IVerificationTokenPayload = { email };

    const token = this.jwtService.sign(payload, {
      secret: this.authConfigService.jwtVerificationTokenSecret,
      expiresIn: this.authConfigService.jwtVerificationTokenExpirationTime,
    });

    const url = `${this.authConfigService.emailConfirmationUrl}?token=${token}`;

    const text = `To confirm your email address click on this link: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Memo Email Confirmation',
      text,
    });
  }

  public async confirmEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (user.isEmailConfirmed) {
      throw new BadRequestException(`Email is already confirmed`);
    }

    await this.userService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.authConfigService.jwtVerificationTokenSecret,
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (e) {
      if (e?.name === 'TokenExpiredError') {
        throw new BadRequestException(`Email confirmation token has expired`);
      }

      throw new BadRequestException(`Bad confirmation token`);
    }
  }

  public async resendConfirmationLink(userId: number) {
    const user = await this.userService.findById(userId);

    if (user.isEmailConfirmed) {
      throw new BadRequestException(`Email is already confirmed!`);
    }

    await this.sendVerificationLink(user.email);
  }
}
