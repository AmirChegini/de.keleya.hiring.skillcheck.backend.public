import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export const DBError = (err: any) => {
  console.log('DB Error:', err);
  console.log('DB Error Detail:', err.detail);
  switch (err.code) {
    case 'P2025': {
      return new NotFoundException('Resource not found.');
    }
    case 'P2002': {
      return new BadRequestException(`${err.meta.target[0]} is in use.`);
    }

    default: {
      return new InternalServerErrorException();
    }
  }
};
