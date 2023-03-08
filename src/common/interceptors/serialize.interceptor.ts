import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { CallHandler, UseInterceptors, NestInterceptor, ExecutionContext } from '@nestjs/common';

import { UserDto } from 'src/user/dto/user.dto';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor<T>(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (data.hasOwnProperty('totalCount')) {
          let users: UserDto[] = [];
          if (data.users.length) {
            users = plainToInstance(this.dto, data.users, {
              excludeExtraneousValues: true,
            });
          }
          return { users, totalCount: data.totalCount };
        } else {
          const user = plainToInstance(this.dto, data.user, {
            excludeExtraneousValues: true,
          });
          return { user };
        }
      }),
    );
  }
}
