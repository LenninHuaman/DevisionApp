import { IsOptional, IsArray, IsPositive } from 'class-validator';

export class FilterDivisionDto {
  @IsOptional()
  @IsArray()
  superiorIds?: number[];

  @IsOptional()
  @IsArray()
  levelValues?: number[];

  @IsOptional()
  @IsArray()
  divisionIds?: number[];

  @IsOptional()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsPositive()
  limit?: number;
}
