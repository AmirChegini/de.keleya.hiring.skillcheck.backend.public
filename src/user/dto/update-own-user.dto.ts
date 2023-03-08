import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateOwnUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Transform(({ value }) => value?.trim())
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  readonly email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*#?&), and be at least 8 characters long.',
  })
  readonly newPassword: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly password: string;
}
