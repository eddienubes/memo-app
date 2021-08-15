import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }

  public async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ${id} has not been found`);
    }

    return user;
  }

  public async getByEmail(email: string): Promise<User> {
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

}
