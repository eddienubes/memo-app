import { ArgumentMetadata, BadRequestException, Inject, PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Express } from 'express';

export type FileType = 'image'; // might be extended in the future

const convertMegabytesToBytes = (megabytes: number) => Math.pow(1024, 2) * megabytes;

const testMimetype = (type: FileType, mimetype: string): boolean => {
  switch (type) {
    case 'image':
      return !!mimetype.match(/\/(jpg|jpeg|png|gif)$/);
    default:
      return false;
  }
}

@Injectable()
export class ParseFilePipe implements PipeTransform {

  constructor(
    private readonly fileType: FileType,
    private readonly sizeLimit?: number // megabytes
  ) {
  }

  transform(value: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
    // console.log(value);
    if (!value) {
      throw new BadRequestException(`Required file has not been attached`);
    }

    const isValid = testMimetype(this.fileType, value.mimetype);

    if (!isValid) {
      throw new BadRequestException(`File [${value.fieldname}] has invalid type`);
    }

    if (value.size > convertMegabytesToBytes(this.sizeLimit) && this.sizeLimit) {
      throw new BadRequestException(`File [${value.fieldname}] exceeds size limit of ${Math.floor(this.sizeLimit)}MBs`);
    }

    return value;
  }
}