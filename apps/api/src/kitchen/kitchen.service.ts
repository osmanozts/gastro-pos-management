import { Injectable, NotFoundException } from '@nestjs/common';
import {
  OrderItemStatus,
  OrderStatus,
} from '../__generated__/prisma';
import { PrismaService } from '../database/prisma.service';

const KITCHEN_STATUSES = [OrderStatus.SENT_TO_KITCHEN, OrderStatus.IN_PROGRESS];

@Injectable()
export class KitchenService {
  constructor(private prisma: PrismaService) {}

  getActiveOrders() {
    return this.prisma.order.findMany({
      where: { status: { in: KITCHEN_STATUSES } },
      select: {
        id: true,
        status: true,
        createdAt: true,
        table: { select: { id: true, number: true, name: true } },
        items: {
          where: {
            parentId: null,
            lineType: { not: 'DRINK' },
          },
          select: {
            id: true,
            status: true,
            lineType: true,
            menuItem: { select: { id: true, name: true } },
            children: {
              where: { lineType: { not: 'DRINK' } },
              select: {
                id: true,
                status: true,
                lineType: true,
                menuItem: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' as const },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async markItemReady(orderId: string, itemId: string) {
    const item = await this.prisma.orderItem.findFirst({
      where: { id: itemId, orderId, parentId: null },
      include: { children: { select: { id: true } } },
    });
    if (!item) throw new NotFoundException('Order item not found');

    const idsToMark = [item.id, ...item.children.map((c) => c.id)];

    await this.prisma.orderItem.updateMany({
      where: { id: { in: idsToMark } },
      data: { status: OrderItemStatus.READY },
    });

    await this.syncOrderStatus(orderId);

    return this.getOrderById(orderId);
  }

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

  private getOrderById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        table: { select: { id: true, number: true, name: true } },
        items: {
          where: {
            parentId: null,
            lineType: { not: 'DRINK' },
          },
          select: {
            id: true,
            status: true,
            lineType: true,
            menuItem: { select: { id: true, name: true } },
            children: {
              where: { lineType: { not: 'DRINK' } },
              select: {
                id: true,
                status: true,
                lineType: true,
                menuItem: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' as const },
        },
      },
    });
  }
}
