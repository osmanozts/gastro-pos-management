import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTableDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}
