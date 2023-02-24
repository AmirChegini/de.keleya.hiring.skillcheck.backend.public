import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs/internal/Observable';
import { IS_PUBLIC_ENDPOINT_KEY } from '../decorators/publicEndpoint.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard(['jwt']) implements CanActivate {
//   private readonly logger = new Logger(JwtAuthGuard.name);

//   constructor(private readonly reflector: Reflector) {
//     super();
//   }

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const getMeta = (key: string) => this.reflector.get(key, context.getHandler());
//     const isPublicEndpoint = getMeta(IS_PUBLIC_ENDPOINT_KEY);
//     if (isPublicEndpoint) return true;
//     return super.canActivate(context);
//   }
// }

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const getMeta = (key: string) => this.reflector.get(key, context.getHandler());
    const isPublicEndpoint = getMeta(IS_PUBLIC_ENDPOINT_KEY);
    if (isPublicEndpoint) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      const message = `Unauthorized request: user not found.`;
      this.logger.error(message);
      this.logger.warn(message);
      throw new UnauthorizedException();

      return false;
    }
    if (!user.is_admin) {
      const message = `Unauthorized request: user ${user.id} is not an admin`;
      this.logger.error(message);
      this.logger.warn(message);
      throw new ForbiddenException();
      return false;
    }

    return true;
  }
}
