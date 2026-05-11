import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'clx1234567890' })
  @IsString()
  tableId!: string;

  @ApiPropertyOptional({ example: 'Tisch am Fenster' })
  @IsString()
  @IsOptional()
  notes?: string;
}
