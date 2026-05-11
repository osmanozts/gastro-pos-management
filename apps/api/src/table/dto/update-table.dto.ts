import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTableDto {
  @ApiPropertyOptional({ example: 'Tisch am Fenster' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 4, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}
