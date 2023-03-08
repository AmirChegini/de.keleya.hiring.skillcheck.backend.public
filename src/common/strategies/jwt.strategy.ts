import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { isJwtTokenUser, JwtTokenUser } from '../types/jwtTokenUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }
  async validate(payload: JwtTokenUser): Promise<any> {
    if (isJwtTokenUser(payload)) {
      if (payload.hasOwnProperty('id') && payload.hasOwnProperty('isAdmin')) return { ...payload };
    }
    throw new UnauthorizedException();
  }
}
