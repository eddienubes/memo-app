import { Roles, User } from '../../src/user/entities/user.entity';

export const mockedUser: User = {
  id: 1,
  email: 'email@lqws.dcom',
  username: 'helloasdasd',
  password: 'heyweasdcxzc',
  phrases: [],
  choices: [],
  files: [],
  isRegisteredWithGoogle: false,
  isEmailConfirmed: true,
  isTwoFactorAuthEnabled: false,
  twoFactorAuthSecret: 'secret',
  roles: [Roles.PUBLIC],
};
