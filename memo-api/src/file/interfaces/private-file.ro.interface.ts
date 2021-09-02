import { Readable } from 'stream';
import { PrivateFile } from '../entities/private-file.entity';

export interface IPrivateFileRO {
  stream: Readable,
  info: PrivateFile
}

export interface IPrivateFileWithUrlRO {
  file: PrivateFile,
  url: string
}