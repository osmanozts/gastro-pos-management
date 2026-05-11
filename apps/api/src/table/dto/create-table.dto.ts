import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  number!: number;

  @ApiPropertyOptional({ example: 'Tisch am Fenster' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 4, minimum: 1 })
  @IsInt()
  @Min(1)
  capacity!: number;
}
