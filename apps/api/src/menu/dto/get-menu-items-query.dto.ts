import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { MenuItemType } from '../../__generated__/prisma';

export class GetMenuItemsQueryDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsEnum(MenuItemType)
  @IsOptional()
  type?: MenuItemType;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  available?: boolean;
}
