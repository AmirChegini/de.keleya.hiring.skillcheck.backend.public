import { BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';

export const DBError = (err: any) => {
  console.log('DB Error:', err);
  console.log('DB Error Detail:', err.detail);
  switch (err.code) {
    case 'P2025': {
      return new NotFoundException('Resource not found.');
    }
    // case '23503': {
    //   if (err.detail.includes('is still referenced from table')) {
    //     return new ForbiddenException('you are not allowed to delete.');
    //   }
    //   if (err.detail.includes('is not present in table')) {
    //     return new BadRequestException(
    //       `invalid ${err.detail.split('(')[1].split(`)`)[0]}.`,
    //     );
    //   }
    //   return new BadRequestException(err.detail);
    // }
    default: {
      return new InternalServerErrorException();
    }
  }
};
