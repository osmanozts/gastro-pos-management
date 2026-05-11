import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../__generated__/prisma';

export class GetOrdersQueryDto {
  @ApiPropertyOptional({ example: 'clx1234567890' })
  @IsString()
  @IsOptional()
  tableId?: string;

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
