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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { AddOrderItemsDto } from './dto/add-order-items.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { UpdateOrderItemStatusDto } from './dto/update-order-item-status.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetOrdersQueryDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Post(':id/items')
  addItems(@Param('id') id: string, @Body() dto: AddOrderItemsDto) {
    return this.orderService.addItems(id, dto);
  }

  @Delete(':id/items/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.orderService.removeItem(id, itemId);
  }

  @Patch(':id/send')
  sendToKitchen(@Param('id') id: string) {
    return this.orderService.sendToKitchen(id);
  }

  @Get(':id/bill')
  getBill(@Param('id') id: string) {
    return this.orderService.getBill(id);
  }

  @Patch(':id/items/:itemId/status')
  updateItemStatus(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateOrderItemStatusDto,
  ) {
    return this.orderService.updateItemStatus(id, itemId, dto);
  }
}
