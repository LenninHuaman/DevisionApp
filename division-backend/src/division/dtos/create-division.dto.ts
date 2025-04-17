import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  @MaxLength(45)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  ambassador?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  superiorId?: number;
}
