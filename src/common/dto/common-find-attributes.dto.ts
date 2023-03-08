import { SortEnum } from '../enums/sort-by.enum';

export class CommonFindAttributesDto {
  limit: number;
  offset: number;
  sort: SortEnum;
}
