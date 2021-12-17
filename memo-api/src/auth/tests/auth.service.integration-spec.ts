import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { mockedUser } from '../../../test/mocks/mocked-data';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../../../test/mocks/config.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../../test/mocks/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';

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
      ...mockedUser,
    };

    findUser = jest.fn().mockResolvedValue(userData);
    const userRepository = {
      findOne: findUser,
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    userService = await module.get<UserService>(UserService);
  });

  describe('when accessing the data of authenticated user', () => {
    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw an error', async () => {
        await expect(
          authService.getAuthenticatedUser(
            'asdasdasd@asd,ka/cjqwe',
            'asdqwdasdazxc',
          ),
        ).rejects.toThrow();
      });
    });

    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      describe('the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        });

        it('should return the user data', async () => {
          const user = await authService.getAuthenticatedUser(
            'asdasd',
            'asdasda',
          );
          expect(user).toEqual(userData);
        });
      });

      describe('the user is not found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });

        it('should throw an error', async () => {
          await expect(
            authService.getAuthenticatedUser('asdasd', 'asdasdasd'),
          ).rejects.toThrow();
        });
      });
    });
  });
});
