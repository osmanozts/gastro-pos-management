import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  tableId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
