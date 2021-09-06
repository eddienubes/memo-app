import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class PaginationQueryDto {
  @Max(Number.MAX_VALUE)
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  limit: number;

  @Max(Number.MAX_VALUE)
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  offset: number;
}