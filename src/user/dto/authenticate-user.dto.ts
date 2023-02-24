import { IsString, MinLength } from 'class-validator';

export class AuthenticateUserDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
