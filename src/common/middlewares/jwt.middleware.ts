// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { UserService } from './user.service';

//ADDED
// @Injectable()
// export class JwtMiddleware implements NestMiddleware {
//   constructor(private readonly userService: UserService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (token) {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       if (decoded) {
//         const user = await this.userService.findUnique({ id: decoded.id });
//         if (user) {
//           req.user = user;
//         }
//       }
//     }
//     next();
//   }
// }