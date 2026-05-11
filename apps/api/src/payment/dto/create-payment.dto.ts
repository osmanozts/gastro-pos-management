import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '../../__generated__/prisma';

export class PaymentAllocationDto {
  @IsString()
  orderItemId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;
}

export class CreatePaymentDto {
  @IsString()
  orderId: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentAllocationDto)
  allocations: PaymentAllocationDto[];
}
