import { SetMetadata } from '@nestjs/common';
import { Roles as RolesEnum } from '../../user/entities/user.entity';

export const RolesMetadata = (...roles: RolesEnum[]) =>
  SetMetadata('roles', roles);
