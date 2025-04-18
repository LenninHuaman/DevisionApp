import { DivisionItemDto } from './division-item.dto';

export interface DivisionPaginationDto {
  data: DivisionItemDto[];
  total: number;
  page: number;
  limit: number;
}
