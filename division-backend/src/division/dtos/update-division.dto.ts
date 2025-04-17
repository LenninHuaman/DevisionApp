import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDivisionDto {
  @IsOptional()
  @IsString()
  @MaxLength(45)
  name?: string;

  @IsOptional()
  @IsInt()
  level?: number;

  @IsOptional()
  @IsInt()
  collaborators?: number;

  @IsOptional()
  @IsString()
  ambassador?: string;

  @IsOptional()
  @IsInt()
  superiorId?: number;
}
