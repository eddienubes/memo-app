import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { ConfigType } from '@nestjs/config';
import { emailConfig } from '../../common/config/email-config';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    @Inject(emailConfig.KEY)
    private readonly configService: ConfigType<typeof emailConfig>,
  ) {
    this.nodemailerTransport = createTransport({
      service: configService.emailService,
      auth: {
        user: configService.emailUser,
        pass: configService.emailPassword,
      },
    });
  }

  public sendMail(options: Mail.Options): Promise<any> {
    return this.nodemailerTransport.sendMail(options);
  }
}
