// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { UserService } from './user.service';

//ADDED
// @Injectable()
// export class AttachUserMiddleware implements NestMiddleware {
//   constructor(private readonly userService: UserService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const userId = req.user.id;
//     const user = await this.userService.findUnique({ id: userId });
//     if (user) {
//       req.user = user;
//       next();
//     } else {
//       // handle error
//     }
//   }
// }