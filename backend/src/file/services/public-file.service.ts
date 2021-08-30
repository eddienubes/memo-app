import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicFile } from '../entities/public-file.entity';
import { S3 } from 'aws-sdk';
import { ConfigType } from '@nestjs/config';
import { awsConfig } from '../../common/config/aws-config';
import { v4 as uuid } from 'uuid';
import { CreateFileDto } from '../dtos/create-file.dto';
import { databaseConfig } from '../../common/config/database-config';

@Injectable()
export class PublicFileService {
  constructor(
    @InjectRepository(PublicFile)
    private readonly fileRepository: Repository<PublicFile>,
    @Inject(awsConfig.KEY)
    private readonly configService: ConfigType<typeof awsConfig>,
  ) {
  }

  public async uploadPublicFile(createFileDto: CreateFileDto): Promise<PublicFile> {
    const s3 = new S3();

    const uploadResult = await s3.upload({
      Bucket: this.configService.awsUserAvatarsBucketName,
      Body: createFileDto.buffer,
      Key: `${uuid()}-${createFileDto.filename}`
    }).promise();

    const newFile = this.fileRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location
    });

    return this.fileRepository.save(newFile);
  }

  public async deletePublicFile(fileId: number): Promise<PublicFile> {
    const file = await this.findOne(fileId);

    const s3 = new S3();

    await s3.deleteObject({
      Bucket: this.configService.awsUserAvatarsBucketName,
      Key: file.key
    }).promise();

    await this.fileRepository.delete(fileId);

    return file;
  }

  private async findOne(fileId: number): Promise<PublicFile> {
    const file = await this.fileRepository.findOne(fileId);

    if (!file) {
      throw new NotFoundException(`File with id ${fileId} was not found!`);
    }

    return file;
  }

}
