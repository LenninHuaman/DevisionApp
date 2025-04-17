import { DivisionItemDto } from './division-item.dto';

export interface DivisionPaginationResponseDto {
  data: DivisionItemDto[];
  total: number;
  page: number;
  limit: number;
}
