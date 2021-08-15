import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const AUTH_CONFIG_TOKEN = 'auth';

export const authConfig = registerAs(AUTH_CONFIG_TOKEN, () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME
}));

export const authConfigSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required()
});