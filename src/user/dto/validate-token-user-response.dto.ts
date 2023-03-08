import { Expose } from 'class-transformer';
import { JwtTokenUser } from 'src/common/types/jwtTokenUser';

class JwtTokenUserClass implements JwtTokenUser {
  id: number;
  isAdmin: boolean;
}

export class ValidateTokenUserResponseDto {
  @Expose()
  decodedToken: JwtTokenUserClass;
}
