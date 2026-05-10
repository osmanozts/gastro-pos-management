import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { GetMenuItemsQueryDto } from './dto/get-menu-items-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuService } from './menu.service';

@Controller('menu')
@UseGuards(AuthGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get('categories')
  getCategories() {
    return this.menuService.findAllCategories();
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return this.menuService.findCategoryById(id);
  }

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.menuService.createCategory(dto);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.menuService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.menuService.deleteCategory(id);
  }

  @Get('items')
  getItems(@Query() query: GetMenuItemsQueryDto) {
    return this.menuService.findAllItems(query);
  }

  @Get('items/:id')
  getItem(@Param('id') id: string) {
    return this.menuService.findItemById(id);
  }

  @Post('items')
  createItem(@Body() dto: CreateMenuItemDto) {
    return this.menuService.createItem(dto);
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.updateItem(id, dto);
  }

  @Patch('items/:id/toggle')
  toggleItem(@Param('id') id: string) {
    return this.menuService.toggleItemAvailability(id);
  }

  @Delete('items/:id')
  deleteItem(@Param('id') id: string) {
    return this.menuService.deleteItem(id);
  }
}
