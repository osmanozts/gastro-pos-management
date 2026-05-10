import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderItemStatus,
  OrderStatus,
  Prisma,
  TableStatus,
} from '../__generated__/prisma';
import { PrismaService } from '../database/prisma.service';
import { AddOrderItemsDto } from './dto/add-order-items.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderItemStatusDto } from './dto/update-order-item-status.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // ─── Queries ─────────────────────────────────────────────────

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: this.orderInclude(),
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getBill(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: { select: { id: true, name: true } },
            paymentAllocations: { select: { amount: true } },
            children: {
              include: {
                menuItem: { select: { id: true, name: true } },
                paymentAllocations: { select: { amount: true } },
              },
            },
          },
          where: { parentId: null },
          orderBy: { createdAt: 'asc' },
        },
        payments: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    const itemSummaries = order.items.map((item) => {
      const lineTotal = new Prisma.Decimal(item.unitPrice).mul(item.quantity);
      const paid = item.paymentAllocations.reduce(
        (sum, a) => sum.plus(a.amount),
        new Prisma.Decimal(0),
      );
      return {
        id: item.id,
        menuItem: item.menuItem,
        lineType: item.lineType,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        status: item.status,
        lineTotal,
        paid,
        remaining: lineTotal.minus(paid),
        addons: item.children.map((child) => ({
          id: child.id,
          menuItem: child.menuItem,
          lineType: child.lineType,
          quantity: child.quantity,
          unitPrice: child.unitPrice,
          notes: child.notes,
          status: child.status,
        })),
      };
    });

    const grandTotal = itemSummaries.reduce(
      (sum, i) => sum.plus(i.lineTotal),
      new Prisma.Decimal(0),
    );
    const totalPaid = itemSummaries.reduce(
      (sum, i) => sum.plus(i.paid),
      new Prisma.Decimal(0),
    );

    return {
      orderId: order.id,
      tableId: order.tableId,
      status: order.status,
      notes: order.notes,
      items: itemSummaries,
      grandTotal,
      totalPaid,
      remaining: grandTotal.minus(totalPaid),
      payments: order.payments,
    };
  }

  // ─── Commands ────────────────────────────────────────────────

  async create(dto: CreateOrderDto) {
    await this.findTableOrThrow(dto.tableId);

    const [order] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: { tableId: dto.tableId, notes: dto.notes },
        include: this.orderInclude(),
      }),
      this.prisma.table.update({
        where: { id: dto.tableId },
        data: { status: TableStatus.OCCUPIED },
      }),
    ]);

    return order;
  }

  async addItems(orderId: string, dto: AddOrderItemsDto) {
    const order = await this.findOrderOrThrow(orderId);

    if (
      order.status === OrderStatus.PAID ||
      order.status === OrderStatus.CLOSED
    ) {
      throw new BadRequestException(
        'Cannot add items to a paid or closed order',
      );
    }

    const itemsData: Prisma.OrderItemCreateManyInput[] = [];

    for (const item of dto.items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });
      if (!menuItem)
        throw new NotFoundException(`MenuItem ${item.menuItemId} not found`);
      if (!menuItem.available)
        throw new BadRequestException(
          `MenuItem "${menuItem.name}" is not available`,
        );

      if (item.parentId) {
        const parent = await this.prisma.orderItem.findFirst({
          where: { id: item.parentId, orderId },
        });
        if (!parent)
          throw new NotFoundException(
            `Parent item ${item.parentId} not found in this order`,
          );
      }

      itemsData.push({
        orderId,
        menuItemId: item.menuItemId,
        lineType: item.lineType,
        quantity: item.quantity ?? 1,
        unitPrice: menuItem.price,
        notes: item.notes,
        parentId: item.parentId,
        status: OrderItemStatus.CREATED,
      });
    }

    await this.prisma.orderItem.createMany({ data: itemsData });

    return this.findById(orderId);
  }

  async sendToKitchen(orderId: string) {
    const order = await this.findOrderOrThrow(orderId);

    if (
      order.status === OrderStatus.PAID ||
      order.status === OrderStatus.CLOSED
    ) {
      throw new BadRequestException(
        'Cannot send a paid or closed order to kitchen',
      );
    }

    const createdCount = await this.prisma.orderItem.count({
      where: { orderId, status: OrderItemStatus.CREATED },
    });

    if (createdCount === 0) {
      throw new BadRequestException('No new items to send to kitchen');
    }

    await this.prisma.orderItem.updateMany({
      where: { orderId, status: OrderItemStatus.CREATED },
      data: { status: OrderItemStatus.SENT_TO_KITCHEN },
    });

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.SENT_TO_KITCHEN },
      include: this.orderInclude(),
    });
  }

  // ─── Called by PaymentService after payment ───────────────────

  async syncStatusAfterPayment(orderId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
      select: { status: true },
    });

    if (items.length === 0) return;

    const statuses = items.map((i) => i.status);
    const allPaid = statuses.every((s) => s === OrderItemStatus.PAID);

    if (!allPaid) return;

    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CLOSED },
      select: { tableId: true },
    });

    const openCount = await this.prisma.order.count({
      where: {
        tableId: order.tableId,
        status: { notIn: [OrderStatus.PAID, OrderStatus.CLOSED] },
      },
    });

    if (openCount === 0) {
      await this.prisma.table.update({
        where: { id: order.tableId },
        data: { status: TableStatus.FREE },
      });
    }
  }

  // ─── Kitchen/Service item status updates ─────────────────────

  async updateItemStatus(
    orderId: string,
    itemId: string,
    dto: UpdateOrderItemStatusDto,
  ) {
    await this.findOrderOrThrow(orderId);
    const item = await this.prisma.orderItem.findFirst({
      where: { id: itemId, orderId },
    });
    if (!item) throw new NotFoundException('Order item not found');

    if (dto.status === OrderItemStatus.PAID) {
      throw new BadRequestException(
        'PAID status is set by the payment system, not manually',
      );
    }

    await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status: dto.status },
    });

    await this.syncOrderStatus(orderId);

    return this.findById(orderId);
  }

  // ─── Internal ────────────────────────────────────────────────

  private async syncOrderStatus(orderId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
      select: { status: true },
    });

    const statuses = items.map((i) => i.status);

    const allServedOrPaid = statuses.every(
      (s) => s === OrderItemStatus.SERVED || s === OrderItemStatus.PAID,
    );
    const allReadyOrBetter = statuses.every(
      (s) =>
        s === OrderItemStatus.READY ||
        s === OrderItemStatus.SERVED ||
        s === OrderItemStatus.PAID,
    );
    const someReadyOrBetter = statuses.some(
      (s) =>
        s === OrderItemStatus.READY ||
        s === OrderItemStatus.SERVED ||
        s === OrderItemStatus.PAID,
    );
    const someInKitchen = statuses.some(
      (s) => s === OrderItemStatus.SENT_TO_KITCHEN,
    );

    let newStatus: OrderStatus;
    if (allServedOrPaid) {
      newStatus = OrderStatus.SERVED;
    } else if (allReadyOrBetter) {
      newStatus = OrderStatus.READY;
    } else if (someReadyOrBetter && someInKitchen) {
      newStatus = OrderStatus.IN_PROGRESS;
    } else {
      newStatus = OrderStatus.SENT_TO_KITCHEN;
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  }

  private async findTableOrThrow(id: string) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  private async findOrderOrThrow(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private orderInclude() {
    return {
      table: { select: { id: true, number: true, name: true } },
      items: {
        where: { parentId: null },
        include: {
          menuItem: {
            select: { id: true, name: true, price: true, type: true },
          },
          children: {
            include: {
              menuItem: {
                select: { id: true, name: true, price: true, type: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' as const },
      },
      payments: { orderBy: { createdAt: 'asc' as const } },
    };
  }
}
