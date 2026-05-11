import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'clx1234567890' })
  @IsString()
  menuItemId!: string;

  @ApiProperty({ enum: OrderItemLineType })
  @IsEnum(OrderItemLineType)
  lineType!: OrderItemLineType;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ example: 'ohne Zwiebeln' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'clx0987654321' })
  @IsString()
  @IsOptional()
  parentId?: string;
}

export class AddOrderItemsDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
