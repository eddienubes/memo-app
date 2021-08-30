import { INestApplication, ValidationPipe } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { mockedUser } from '../../utils/mocks/mocked-data';
import { AuthController } from '../auth.controller';
import { Test } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetadataInterceptor } from '../../common/interceptors/metadata.interceptor';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest'

describe('AuthController', () => {
  let app: INestApplication;
  let userData: User;
  let userRepository;

  beforeEach(async () => {
    userData = {
      ...mockedUser
    };


    userRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockResolvedValue(userData),
      findOne: jest.fn().mockResolvedValue(undefined)
    };

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.useGlobalInterceptors(new MetadataInterceptor());
    app.use(cookieParser());

    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      // beforeEach(() => {
      //   userRepository.findOne.mockResolvedValue(undefined);
      // });

      it('should respond with the user data without a password', () => {
        const expectedData = {
          ...userData
        };

        delete expectedData.password;
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: mockedUser.email,
            username: mockedUser.username,
            password: mockedUser.password
          })
          .expect(201)
          .expect(expectedData);
      });

      describe('and using invalid data', () => {
        it('should throw an error', async () => {
          return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
              name: mockedUser.username
            })
            .expect(400);
        });
      });
    });
  });
});