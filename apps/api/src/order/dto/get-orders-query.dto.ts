import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../__generated__/prisma';

export class GetOrdersQueryDto {
  @IsString()
  @IsOptional()
  tableId?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
