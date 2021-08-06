import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {
  }

  public async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} has not been found`);
    }

    return user;
  }


  public async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      email: createUserDto.email
    });

    if (existingUser) {
      throw new BadRequestException(`User with such email already exist in the database`);
    }
    const newUser = await this.usersRepository.create({
      ...createUserDto,
    });

    return this.usersRepository.save(newUser);
  }

}
