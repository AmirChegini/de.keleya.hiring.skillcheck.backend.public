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
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonFindAttributesDto } from 'src/common/dto/common-find-attributes.dto';

import { SortEnum } from 'src/common/enums/sort-by.enum';
import { UserSortEnum } from 'src/common/enums/user-sort.enum';

export class FindUserDto extends CommonFindAttributesDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserSortEnum)
  sortBy: UserSortEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SortEnum)
  sort: SortEnum;

  @ApiPropertyOptional()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  updatedSince: Date;

  @ApiPropertyOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsOptional()
  id: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  email_confirmed: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  is_admin: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  includeDeleted: boolean;
}
