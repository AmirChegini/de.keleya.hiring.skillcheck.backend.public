import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

//ADDED
//Mix this with query exception filter file
export const DBError = (err: any) => {
  console.log('DB Error:', err);
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
