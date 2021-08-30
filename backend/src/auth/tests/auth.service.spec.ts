import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import * as bcrypt from 'bcrypt';
import { mockedUser } from '../../utils/mocks/mocked-data';
import { find } from 'rxjs';

describe('AuthService units', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {}
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        }
      ]
    }).compile();

    authService = await module.get<AuthService>(AuthService);
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authService.getCookieWithJwtToken(userId)
      ).toEqual('string');
    });
  });
});

jest.mock('bcrypt');

describe('AuthService integration with UserService', () => {
  let authService: AuthService;
  let userService: UserService;
  let bcryptCompare: jest.Mock;
  let userData: User;
  let findUser: jest.Mock;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    userData = {
      ...mockedUser
    };

    findUser = jest.fn().mockResolvedValue(userData);
    const userRepository = {
      findOne: findUser
    };

    
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}
        }
      ]
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    userService = await module.get<UserService>(UserService);
  });

  describe('when accessing the data of authenticated user', () => {
    it('should attempt to get the user by email', async () => {
      const getByEmailSpy = jest.spyOn(userService, 'getByEmail');
      await authService.getAuthenticatedUser('user@dummy.asdqwe', 'passqweqdasd');
      expect(getByEmailSpy).toBeCalledTimes(1);
    });
  });
});