import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

//ADDED
@Injectable()
export class RolesGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }
    console.log("user:",user)
    const isAdmin = user.isAdmin;
    console.log("isAdmin:",isAdmin)
    if (!isAdmin) {
      throw new ForbiddenException('You are not authorized to access this resource.');
    }

    return true;
  }
}
