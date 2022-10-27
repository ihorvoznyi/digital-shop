import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { OrderService } from './order.service';

import { CreateOrderDto } from './dtos';

import { IAuth } from '../auth/interfaces/auth.interface';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  getOrders(@Req() req: Request<IAuth>) {
    return this.orderService.getOrders(req.user['sub']);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
}
