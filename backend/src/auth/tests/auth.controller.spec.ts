import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { authConfig } from './config/auth-config';
import { CreateUserDto } from '../user/dtos/create-user.dto';

describe('AuthController', () => {
  // let authController: AuthController;
  let authService: AuthService;


  beforeEach(async () => {

    // authController = new AuthController(authService);
  });

  describe('signUp', () => {
    // it('should return registered user', async () => {
    //
    //   expect(typeof await authService.register({
    //     username: 'dummy',
    //     password: 'dummydummy',
    //     email: 'dummydummy@dummy.dummy'
    //   }));
    // });
  })

});
