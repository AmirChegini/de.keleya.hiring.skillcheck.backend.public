import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class AuthenticateUserDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
