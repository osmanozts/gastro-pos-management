import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateTableDto {
  @IsInt()
  @IsPositive()
  number: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  capacity: number;
}
