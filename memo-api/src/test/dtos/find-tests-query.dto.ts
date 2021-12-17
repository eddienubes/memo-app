import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindTestsQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  done: boolean;
}
