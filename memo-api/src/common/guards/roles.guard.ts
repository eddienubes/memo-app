import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IRequestWithUser } from '../../auth/interfaces/request-with-user.interface';
import { Roles } from '../../user/entities/user.entity';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {

  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler())

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IRequestWithUser>();
    const user = request.user;

    const rolesIntersection = roles.filter((role) => user.roles.includes(role));

    return rolesIntersection.length > 0;
  }
}