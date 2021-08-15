import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const SERVER_CONFIG_TOKEN = 'server';

export const serverConfig = registerAs(SERVER_CONFIG_TOKEN, () => ({
  port: process.env.PORT || 5000
}));

export const serverConfigSchema = Joi.object({
  PORT: Joi.number().required(),
});