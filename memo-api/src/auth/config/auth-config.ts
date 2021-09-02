import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

interface IAuthConfig {
  jwtAccessTokenSecret: string;
  jwtAccessTokenExpirationTime: string;
  jwtRefreshTokenSecret: string;
  jwtRefreshTokenExpirationTime: string;
}

export const AUTH_CONFIG_TOKEN = 'auth';

export const authConfig = registerAs(AUTH_CONFIG_TOKEN, (): IAuthConfig => ({
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtRefreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
}));

export const authConfigSchema = Joi.object({
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required()
});