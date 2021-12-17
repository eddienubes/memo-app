import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

interface IAwsConfig {
  awsRegion: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsUserAvatarsBucketName: string;
  awsUserPrivateBucketName: string;
  awsPrivateFileUrlExpireTime: number;
}

export const AWS_CONFIG_TOKEN = 'aws-config';

export const awsConfigSchema = Joi.object({
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_USER_AVATARS_BUCKET_NAME: Joi.string().required(),
  AWS_USER_PRIVATE_BUCKET_NAME: Joi.string().required(),
  AWS_PRIVATE_FILE_URL_EXPIRE_TIME: Joi.number().required(),
});

export const awsConfig = registerAs(AWS_CONFIG_TOKEN, () => {
  const config: IAwsConfig = {
    awsRegion: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsUserAvatarsBucketName: process.env.AWS_USER_AVATARS_BUCKET_NAME,
    awsUserPrivateBucketName: process.env.AWS_USER_PRIVATE_BUCKET_NAME,
    awsPrivateFileUrlExpireTime: +process.env.AWS_PRIVATE_FILE_URL_EXPIRE_TIME,
  };
  return config;
});
