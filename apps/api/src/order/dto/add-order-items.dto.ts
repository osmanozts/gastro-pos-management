import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderItemLineType } from '../../__generated__/prisma';

export class OrderItemDto {
  @IsString()
  menuItemId: string;

  @IsEnum(OrderItemLineType)
  lineType: OrderItemLineType;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}

export class AddOrderItemsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
