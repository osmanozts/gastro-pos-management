import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MenuItemType } from '../../__generated__/prisma';

export class CreateMenuItemDto {
  @IsString()
  categoryId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsEnum(MenuItemType)
  type: MenuItemType;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
