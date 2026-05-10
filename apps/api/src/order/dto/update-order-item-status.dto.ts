import { IsEnum } from 'class-validator';
import { OrderItemStatus } from '../../__generated__/prisma';

export class UpdateOrderItemStatusDto {
  @IsEnum(OrderItemStatus)
  status: OrderItemStatus;
}
