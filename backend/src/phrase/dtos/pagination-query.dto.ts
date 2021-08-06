import { IsNumber, IsOptional, IsPositive } from 'class-validator';


export class PaginationQueryDto {
  @IsPositive()
  @IsOptional()
  limit: number;
}