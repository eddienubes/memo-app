import { registerAs } from '@nestjs/config';
import Joi from '@hapi/joi';

interface IEmailConfig {
  emailService: string;
  emailUser: string;
  emailPassword: string;
}

export const EMAIL_CONFIG_TOKEN = 'email';

export const emailConfig = registerAs(
  EMAIL_CONFIG_TOKEN,
  (): IEmailConfig => ({
    emailService: process.env.EMAIL_SERVICE,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
  }),
);

export const emailConfigValidationSchema = Joi.object({
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
});
