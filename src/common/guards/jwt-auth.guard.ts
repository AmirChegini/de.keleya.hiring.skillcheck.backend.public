import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs/internal/Observable';
import { IS_PUBLIC_ENDPOINT_KEY } from '../decorators/publicEndpoint.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log("here 1")
    const getMeta = (key: string) => this.reflector.get(key, context.getHandler());
    console.log("here 2")
    const isPublicEndpoint = getMeta(IS_PUBLIC_ENDPOINT_KEY);
    console.log("here 3")
    if (isPublicEndpoint) return true;
    console.log("here 4",)
    console.log("context:",context["req"])
    console.log("getMeta:",getMeta)
    // return super.canActivate(context);
  }
}



