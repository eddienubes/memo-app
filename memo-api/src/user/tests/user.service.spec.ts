import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne
          }
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('when getting a user by email', () => {
    describe('and the user exists in the database', () => {
      let user: User;

      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return the user', async () => {
        const fetchedUser = await userService.findByEmail('testemail.@emaiasd./coqwe');
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('and the user does not exist in the database', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        await expect(userService.findByEmail('qweqwqe@.qwmeas.com')).rejects.toThrow();
      });
    });
  })
});
