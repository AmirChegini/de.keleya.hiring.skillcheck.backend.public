import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Transform(({ value }) => value?.trim())
  readonly name: string;

  @IsEmail()
  @Transform(({ value }) => value?.trim())
  readonly email: string;

  @IsString()
  @MaxLength(16)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*#?&), and be at least 8 characters long.',
  })
  readonly password: string;

  @IsBoolean()
  @IsOptional()
  readonly isAdmin?: boolean;
}
