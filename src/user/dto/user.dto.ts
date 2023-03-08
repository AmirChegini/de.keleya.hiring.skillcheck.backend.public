import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email?: string;

  @Expose()
  email_confirmed: boolean;

  @Expose()
  is_admin: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}

export class UserListResponseDto {
  @Expose()
  users: UserDto[];

  @Expose()
  totalCount: number;
}

export class UserSingleResponseDto {
  @Expose()
  user: UserDto;
}

export class UserProfileDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email?: string;
}

export class UserProfileResponseDto {
  @Expose()
  user: UserProfileDto;
}

export class UserOwnUserIdDto {
  @Expose()
  id: number;
}

export class UserOwnUserIdResponseDto {
  @Expose()
  user: UserOwnUserIdDto;
}
