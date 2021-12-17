import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

interface IEmailManagerConfig {
  host: string;
  port: number;
}

export const EMAIL_MANAGER_CONFIG_TOKEN = 'email-manager-config';

export const emailManagerConfig = registerAs(
  EMAIL_MANAGER_CONFIG_TOKEN,
  (): IEmailManagerConfig => ({
    host: process.env.EMAIL_SERVICE_HOST,
    port: +process.env.EMAIL_SERVICE_PORT,
  }),
);

export const emailManagerValidationSchema = Joi.object({
  EMAIL_SERVICE_HOST: Joi.string().required(),
  EMAIL_SERVICE_PORT: Joi.number().required(),
});
