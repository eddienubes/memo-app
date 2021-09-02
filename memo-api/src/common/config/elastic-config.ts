import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

interface IElasticConfig {
  elasticSearchNode: string;
  elasticSearchUsername: string;
  elasticSearchPassword: string;
}

export const ELASTIC_CONFIG_TOKEN = 'elastic';

export const elasticConfig = registerAs(ELASTIC_CONFIG_TOKEN, (): IElasticConfig => ({
  elasticSearchNode: process.env.ELASTICSEARCH_NODE,
  elasticSearchUsername: process.env.ELASTICSEARCH_USERNAME,
  elasticSearchPassword: process.env.ELASTICSEARCH_PASSWORD
}));

export const elasticConfigSchema = Joi.object({
  ELASTICSEARCH_NODE: Joi.string().required(),
  ELASTICSEARCH_USERNAME: Joi.string().required(),
  ELASTICSEARCH_PASSWORD: Joi.string().required()

});
