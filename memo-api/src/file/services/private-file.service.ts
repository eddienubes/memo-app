import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivateFile } from '../entities/private-file.entity';
import { Repository } from 'typeorm';
import { awsConfig } from '../../common/config/aws-config';
import { ConfigType } from '@nestjs/config';
import { CreateFileDto } from '../dtos/create-file.dto';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Readable } from 'stream';
import { IPrivateFileRO } from '../interfaces/private-file.ro.interface';

@Injectable()
export class PrivateFileService {
  constructor(
    @InjectRepository(PrivateFile)
    private readonly privateFileRepository: Repository<PrivateFile>,
    @Inject(awsConfig.KEY)
    private readonly configService: ConfigType<typeof awsConfig>,
  ) {}

  public async uploadPrivateFile(
    createFileDto: CreateFileDto,
    ownerId: number,
  ): Promise<PrivateFile> {
    const s3 = new S3();

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.awsUserPrivateBucketName,
        Body: createFileDto.buffer,
        Key: `${uuid()}-${createFileDto.filename}`,
      })
      .promise();

    const newFile = this.privateFileRepository.create({
      key: uploadResult.Key,
      owner: {
        id: ownerId,
      },
    });

    return this.privateFileRepository.save(newFile);
  }

  public async getPrivateFile(fileId: number): Promise<IPrivateFileRO> {
    const s3 = new S3();

    const fileInfo = await this.privateFileRepository.findOne(
      { id: fileId },
      { relations: ['owner'] },
    );

    if (!fileInfo) {
      throw new NotFoundException(`File with such id has not been found!`);
    }

    const stream = await s3
      .getObject({
        Bucket: this.configService.awsUserPrivateBucketName,
        Key: fileInfo.key,
      })
      .createReadStream();

    return {
      stream,
      info: fileInfo,
    };
  }

  public async generatePrivateUrl(key: string): Promise<string> {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.awsUserPrivateBucketName,
      Key: key,
      Expires: this.configService.awsPrivateFileUrlExpireTime, // in seconds
    });
  }
}
