import { IsOptional, IsPositive } from 'class-validator';

export class FilterDivisionDto {
  @IsOptional()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsPositive()
  limit?: number;
}
