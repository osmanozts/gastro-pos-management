import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'clx1234567890' })
  @IsString()
  categoryId!: string;

  @ApiProperty({ example: 'Pizza Margherita' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Klassiker mit Tomaten und Mozzarella' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 11.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiProperty({ enum: MenuItemType })
  @IsEnum(MenuItemType)
  type!: MenuItemType;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiPropertyOptional({ example: 0, minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
