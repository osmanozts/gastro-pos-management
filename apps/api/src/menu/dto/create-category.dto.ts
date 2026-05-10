import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
