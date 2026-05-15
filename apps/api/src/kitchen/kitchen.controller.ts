import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { KitchenService } from './kitchen.service';

@ApiTags('kitchen')
@Controller('kitchen')
@UseGuards(AuthGuard)
export class KitchenController {
  constructor(private kitchenService: KitchenService) {}

  @Get('orders')
  getActiveOrders() {
    return this.kitchenService.getActiveOrders();
  }

  @Patch('orders/:orderId/items/:itemId/ready')
  markItemReady(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.kitchenService.markItemReady(orderId, itemId);
  }
}
