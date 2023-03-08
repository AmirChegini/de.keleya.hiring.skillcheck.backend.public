import { Request } from 'express';
import { Catch, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class QueryExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host) {
    const name = exception.name;
    let message = exception.message;
    let errorCode: HttpStatus | string = exception.code;
    const meta = exception.meta;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    switch (errorCode) {
      case 'P2002':
        message = 'Unique Constraint Error';
        errorCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2025':
        message = 'Resource not found';
        errorCode = HttpStatus.NOT_FOUND;
        break;
    }

    const msg = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      errorCode,
      meta,
      name,
    };

    response.status(errorCode).json(msg);
  }
}
