import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { mockedJwtService } from '../../utils/mocks/jwt.service';

describe('AuthService', () => {
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
