import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//ADDED
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
