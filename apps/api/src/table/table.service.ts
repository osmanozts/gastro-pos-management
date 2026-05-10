import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, TableStatus } from '../__generated__/prisma';
import { PrismaService } from '../database/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';

const INACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.CLOSED,
  OrderStatus.PAID,
];

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.table.findMany({
      orderBy: { number: 'asc' },
    });
  }

  async findById(id: string) {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          where: { status: { notIn: INACTIVE_ORDER_STATUSES } },
          include: {
            items: {
              where: { parentId: null },
              include: {
                children: { include: { menuItem: true } },
                menuItem: true,
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  async create(dto: CreateTableDto) {
    const existing = await this.prisma.table.findUnique({
      where: { number: dto.number },
    });
    if (existing) {
      throw new ConflictException(`Table number ${dto.number} already exists`);
    }
    return this.prisma.table.create({ data: dto });
  }

  async update(id: string, dto: UpdateTableDto) {
    await this.findTableOrThrow(id);
    return this.prisma.table.update({ where: { id }, data: dto });
  }

  async updateStatus(id: string, dto: UpdateTableStatusDto) {
    await this.findTableOrThrow(id);
    return this.prisma.table.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async delete(id: string) {
    const table = await this.findTableOrThrow(id);
    if (table.status !== TableStatus.FREE) {
      throw new BadRequestException(
        'Table can only be deleted when status is FREE',
      );
    }
    return this.prisma.table.delete({ where: { id } });
  }

  private async findTableOrThrow(id: string) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }
}
