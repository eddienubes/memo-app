import { INestApplication, ValidationPipe } from '@nestjs/common';
import { User } from '../src/user/entities/user.entity';
import { mockedUser } from './mocks/mocked-data';
import { AuthController } from '../src/auth/controllers/auth.controller';
import { Test } from '@nestjs/testing';
import { AuthService } from '../src/auth/services/auth.service';
import { UserService } from '../src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from './mocks/jwt.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from './mocks/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetadataInterceptor } from '../src/common/interceptors/metadata.interceptor';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { getManager } from 'typeorm';
import { plainToClass } from 'class-transformer';

describe('AuthController', () => {
  let app: INestApplication;
  let userData: User;
  let userRepository;

  beforeEach(async () => {
    userData = plainToClass(User, mockedUser, {
      ignoreDecorators: true,
    });

    userRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockResolvedValue(userData),
      findOne: jest.fn().mockResolvedValue(undefined),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    // app.useGlobalInterceptors(new MetadataInterceptor());
    app.use(cookieParser());

    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      beforeEach(() => {
        userRepository.findOne.mockResolvedValue(undefined);
      });

      it('should respond with the user data without a password', () => {
        const expectedData = { ...userData };

        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: mockedUser.email,
            username: mockedUser.username,
            password: mockedUser.password,
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('and using invalid data', () => {
      beforeEach(() => {
        userRepository.findOne.mockResolvedValue(userData);
      });

      it('should throw an error', async () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            name: mockedUser.username,
          })
          .expect(400);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
