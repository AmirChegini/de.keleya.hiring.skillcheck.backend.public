import { Expose } from 'class-transformer';

export class AuthenticateUserResponseDto {
  @Expose()
  credentials: boolean;
}
