import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Get('order/:id')
  findByOrder(@Param('id') id: string) {
    return this.paymentService.findByOrder(id);
  }
}
