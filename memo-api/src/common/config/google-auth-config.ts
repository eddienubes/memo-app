import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const GOOGLE_AUTH_CONFIG_TOKEN = 'google';

interface IGoogleAuthConfig {
  googleClientId: string;
  googleClientSecret: string;
  googleTwoFactorAuthAppName: string;
}

export const googleAuthConfig = registerAs(
  GOOGLE_AUTH_CONFIG_TOKEN,
  (): IGoogleAuthConfig => ({
    googleClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    googleTwoFactorAuthAppName: process.env.GOOGLE_TWO_FACTOR_AUTH_APP_NAME,
  }),
);

export const googleAuthValidationSchema = Joi.object({
  GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_TWO_FACTOR_AUTH_APP_NAME: Joi.string().required(),
});
