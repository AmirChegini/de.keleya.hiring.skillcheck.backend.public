import { Expose } from 'class-transformer';

export class GetTokenUserResponseDto {
  @Expose()
  token: string;
}
