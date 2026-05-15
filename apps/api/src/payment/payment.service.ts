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
import { OrderService } from '../order/order.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: {
        items: {
          include: {
            paymentAllocations: { select: { amount: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (
      order.status === OrderStatus.PAID ||
      order.status === OrderStatus.CLOSED
    ) {
      throw new BadRequestException('Order is already fully paid');
    }

    // ── Validation: no overpaying per item ───────────────────────
    for (const alloc of dto.allocations) {
      const item = order.items.find((i) => i.id === alloc.orderItemId);
      if (!item) {
        throw new NotFoundException(
          `OrderItem ${alloc.orderItemId} not found in this order`,
        );
      }

      const itemTotal = new Prisma.Decimal(item.unitPrice).mul(item.quantity);
      const alreadyPaid = item.paymentAllocations.reduce(
        (sum, a) => sum.plus(a.amount),
        new Prisma.Decimal(0),
      );
      const remaining = itemTotal.minus(alreadyPaid);

      if (new Prisma.Decimal(alloc.amount).gt(remaining)) {
        throw new BadRequestException(
          `Allocation for item ${alloc.orderItemId} exceeds remaining amount of ${remaining.toFixed(2)}`,
        );
      }
    }

    // ── Persist payment + allocations ────────────────────────────
    const totalAmount = dto.allocations.reduce(
      (sum, a) => sum + a.amount,
      0,
    );

    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        method: dto.method,
        amount: totalAmount,
        allocations: {
          create: dto.allocations.map((a) => ({
            orderItemId: a.orderItemId,
            amount: a.amount,
          })),
        },
      },
      include: {
        allocations: true,
      },
    });

    // ── Mark fully-paid items as PAID ────────────────────────────
    for (const alloc of dto.allocations) {
      const item = order.items.find((i) => i.id === alloc.orderItemId)!;
      const itemTotal = new Prisma.Decimal(item.unitPrice).mul(item.quantity);
      const alreadyPaid = item.paymentAllocations.reduce(
        (sum, a) => sum.plus(a.amount),
        new Prisma.Decimal(0),
      );
      const newTotal = alreadyPaid.plus(new Prisma.Decimal(alloc.amount));

      if (newTotal.gte(itemTotal)) {
        await this.prisma.orderItem.update({
          where: { id: alloc.orderItemId },
          data: { status: OrderItemStatus.PAID },
        });
      }
    }

    // ── Auto-mark free (€0) items as PAID ───────────────────────
    // Zero-price items (free toppings, etc.) cannot receive allocations
    // due to the min-amount validation, so we mark them here automatically.
    await this.prisma.orderItem.updateMany({
      where: {
        orderId: dto.orderId,
        unitPrice: { equals: new Prisma.Decimal(0) },
        status: { not: OrderItemStatus.PAID },
      },
      data: { status: OrderItemStatus.PAID },
    });

    // ── Sync order + table status ────────────────────────────────
    await this.orderService.syncStatusAfterPayment(dto.orderId);

    const updatedOrder = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      select: { status: true, tableId: true },
    });

    if (updatedOrder && updatedOrder.status !== OrderStatus.CLOSED) {
      await this.prisma.table.update({
        where: { id: updatedOrder.tableId },
        data: { status: TableStatus.PARTIALLY_PAID },
      });
    }

    return payment;
  }

  findByOrder(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      include: {
        allocations: {
          include: {
            orderItem: {
              select: {
                id: true,
                quantity: true,
                unitPrice: true,
                menuItem: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
