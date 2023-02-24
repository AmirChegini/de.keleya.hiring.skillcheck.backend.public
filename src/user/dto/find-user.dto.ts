import { Transform } from 'class-transformer';
import {
  Min,
  IsEnum,
  IsDate,
  IsArray,
  IsNumber,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';

import { SortEnum } from 'src/common/enums/sort-by.enum';
import { UserSortEnum } from 'src/common/enums/user-sort.enum';

export class FindUserDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsEnum(UserSortEnum)
  sortBy: UserSortEnum;

  @IsOptional()
  @IsEnum(SortEnum)
  sort: SortEnum;

  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  updatedSince: Date;

  @Transform(({ value }) => JSON.parse(value).map((item) => Number(item)))
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsOptional()
  id: number[];

  @IsOptional()
  @IsString()
  name: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  credentials: number;

  @IsOptional()
  @IsString()
  email: string;

  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  email_confirmed: boolean;

  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  is_admin: boolean;
}
