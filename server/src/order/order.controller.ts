import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos';
import { IAuth } from '../auth/interfaces/auth.interface';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  getOrders(@Req() req: Request<IAuth>) {
    return this.orderService.getOrders(req.user['sub']);
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
}
