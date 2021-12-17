import { Module } from '@nestjs/common';
import { PublicFileService } from './services/public-file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entities/public-file.entity';
import { ConfigModule } from '@nestjs/config';
import { awsConfig } from '../common/config/aws-config';
import { PrivateFile } from './entities/private-file.entity';
import { PrivateFileService } from './services/private-file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicFile, PrivateFile]),
    ConfigModule.forFeature(awsConfig),
  ],

  providers: [PublicFileService, PrivateFileService],
  exports: [PublicFileService, PrivateFileService],
})
export class FileModule {}
