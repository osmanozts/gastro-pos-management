import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { GetMenuItemsQueryDto } from './dto/get-menu-items-query.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  findAllCategories() {
    return this.prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!category) throw new NotFoundException(`Category not found`);
    return category;
  }

  createCategory(dto: CreateCategoryDto) {
    return this.prisma.menuCategory.create({ data: dto });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.findCategoryOrThrow(id);
    return this.prisma.menuCategory.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string) {
    await this.findCategoryOrThrow(id);
    const itemCount = await this.prisma.menuItem.count({
      where: { categoryId: id },
    });
    if (itemCount > 0) {
      throw new BadRequestException(
        `Category still has ${itemCount} item(s). Remove or reassign them first.`,
      );
    }
    return this.prisma.menuCategory.delete({ where: { id } });
  }

  private async findCategoryOrThrow(id: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException(`Category not found`);
    return category;
  }

  // ─── Items ───────────────────────────────────────────────────

  findAllItems(query: GetMenuItemsQueryDto) {
    return this.prisma.menuItem.findMany({
      where: {
        ...(query.categoryId && { categoryId: query.categoryId }),
        ...(query.type && { type: query.type }),
        ...(query.available !== undefined && { available: query.available }),
      },
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    });
  }

  async findItemById(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!item) throw new NotFoundException(`MenuItem not found`);
    return item;
  }

  async createItem(dto: CreateMenuItemDto) {
    await this.findCategoryOrThrow(dto.categoryId);
    return this.prisma.menuItem.create({ data: dto });
  }

  async updateItem(id: string, dto: UpdateMenuItemDto) {
    await this.findItemById(id);
    if (dto.categoryId) await this.findCategoryOrThrow(dto.categoryId);
    return this.prisma.menuItem.update({ where: { id }, data: dto });
  }

  async toggleItemAvailability(id: string) {
    const item = await this.findItemById(id);
    return this.prisma.menuItem.update({
      where: { id },
      data: { available: !item.available },
    });
  }

  async deleteItem(id: string) {
    await this.findItemById(id);
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
