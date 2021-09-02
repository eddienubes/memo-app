import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

interface IServerConfig {
  port: number;
}


export const SERVER_CONFIG_TOKEN = 'server';

export const serverConfig = registerAs(SERVER_CONFIG_TOKEN, (): IServerConfig => ({
  port: +process.env.PORT || 5000
}));

export const serverConfigSchema = Joi.object({
  PORT: Joi.number().required(),
});