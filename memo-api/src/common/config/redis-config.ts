import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

interface IRedisConfig {
  redisHost: string;
  redisPort: number;
}

export const REDIS_CONFIG_TOKEN = 'redis';

export const redisConfig = registerAs(REDIS_CONFIG_TOKEN, (): IRedisConfig => ({
  redisHost: process.env.REDIS_HOST,
  redisPort: +process.env.REDIST_PORT
}));

export const redisConfigValidationSchema = Joi.object({
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required()
});

