import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PublicFileService } from '../../file/services/public-file.service';
import { CreateFileDto } from '../../file/dtos/create-file.dto';
import { PublicFile } from '../../file/entities/public-file.entity';
import { PrivateFile } from '../../file/entities/private-file.entity';
import { PrivateFileService } from '../../file/services/private-file.service';
import { IPrivateFileRO, IPrivateFileWithUrlRO } from '../../file/interfaces/private-file.ro.interface';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly publicFileService: PublicFileService,
    private readonly privateFileService: PrivateFileService,
    private readonly connection: Connection
  ) {
  }

  public async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ${id} has not been found`);
    }

    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} has not been found`);
    }

    return user;
  }


  public async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      email: createUserDto.email
    });

    if (existingUser) {
      throw new BadRequestException(`User with such email already exists!`);
    }
    const newUser = await this.userRepository.create({
      ...createUserDto,
    });

    return this.userRepository.save(newUser);
  }

  public async addAvatar(createFileDto: CreateFileDto, userId: number): Promise<PublicFile> {
    const user = await this.findById(userId);

    if (user.avatar) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null
      });

      await this.publicFileService.deletePublicFile(user.avatar.id);
    }

    const avatar = await this.publicFileService.uploadPublicFile(createFileDto);

    await this.userRepository.update(userId, {
      ...user,
      avatar
    });

    // TODO: Compress image or check the size

    return avatar;
  }

  public async removeAvatar(userId: number): Promise<PublicFile> {
    const queryRunner = this.connection.createQueryRunner();

    const user = await this.findById(userId);

    const fileId = user.avatar?.id;

    if (!fileId) {
      throw new BadRequestException(`You do not have an avatar!`);
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let publicFile;
    try {
      await queryRunner.manager.update(User, userId, {
        ...user,
        avatar: null
      });

      publicFile = await this.publicFileService.deletePublicFileWithQueryRunner(fileId, queryRunner);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new e;
    } finally {
      await queryRunner.release();
    }

    return publicFile;
  }

  public async addPrivateFile(createFileDto: CreateFileDto, userId: number): Promise<PrivateFile> {
    return this.privateFileService.uploadPrivateFile(createFileDto, userId);
  }

  public async getPrivateFile(fileId: number, userId: number): Promise<IPrivateFileRO> {
    const file = await this.privateFileService.getPrivateFile(fileId);

    if (file.info.owner.id !== userId) {
      throw new UnauthorizedException();
    }

    return file;
  }

  public async getAllPrivateFiles(userId: number): Promise<IPrivateFileWithUrlRO[]> {
    const userWithFiles = await this.userRepository.findOne(
      { id: userId },
      { relations: ['files'] }
    );

    if (!userWithFiles) {
      throw new NotFoundException(`User with id ${userId} has not been found!`);
    }

    return Promise.all(
      userWithFiles.files.map(async file => {
        const url = await this.privateFileService.generatePrivateUrl(file.key);
        return {
          file,
          url
        }
      })
    );
  }

  public async setCurrentRefreshToken(refreshToken: string, userId: number): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  public async findUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User | undefined> {
    const user = await this.findById(userId);

    const isValid = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
    console.log(isValid, user);
    if (isValid) {
      return user;
    }

    return undefined;
  }
}
