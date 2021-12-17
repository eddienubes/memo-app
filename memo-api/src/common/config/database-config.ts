import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';

export const DATABASE_CONFIG_TOKEN = 'postgres-database';

export const databaseConfig = registerAs(DATABASE_CONFIG_TOKEN, () => {
  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true, // important
    autoLoadEntities: true,
  };
  return config;
});

export const databaseConfigSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
});
