import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderLine, UserOrder } from '../database/entities';

import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

import { CreateOrderDto, CreateOrderLineDto, SetOrderStatusDto } from './dtos';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderLine)
    private orderLineRepository: Repository<OrderLine>,
    @InjectRepository(UserOrder)
    private userOrderRepository: Repository<UserOrder>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async createOrder(orderDto: CreateOrderDto) {
    const { userId, orderLineList } = orderDto;

    if (!orderLineList.length) {
      throw new HttpException('Order: no products', HttpStatus.BAD_REQUEST);
    }

    let user;

    if (userId) {
      user = await this.userService.getUser({
        where: { id: userId },
      });
    }

    const orderTotal: number = orderLineList.reduce(
      (cur, prev) => cur + prev.quantity * prev.price,
      0,
    );

    const newOrder = this.userOrderRepository.create({
      orderDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      orderTotal,
      orderStatus: 'pending',
      shippingAddress: user.address,
      user,
    });

    const savedOrder = await this.userOrderRepository.save(newOrder);

    const orderLines: OrderLine[] = [];

    for await (const orderLine of orderLineList) {
      const newOrderLine = await this.createOrderLine({
        order: savedOrder,
        productId: orderLine.productId,
        quantity: orderLine.quantity,
        price: orderLine.price,
      });

      orderLines.push(newOrderLine);
    }

    savedOrder.products = orderLines;

    return this.userOrderRepository.save(savedOrder);
  }

  async createOrderLine(orderLineDto: CreateOrderLineDto): Promise<OrderLine> {
    const product = await this.productService.getProduct({
      where: { id: orderLineDto.productId },
    });

    if (!product) {
      throw new HttpException(
        "Order: product doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }

    const { quantity, price, order } = orderLineDto;

    const newOrder = this.orderLineRepository.create({
      quantity,
      price,
      order,
      product,
    });

    return this.orderLineRepository.save(newOrder);
  }

  async getOrders(userId: string) {
    const user = await this.userService.getUser({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException("User: doesn't exist", HttpStatus.BAD_REQUEST);
    }

    return this.userOrderRepository.find({
      where: { user },
    });
  }

  async setOrderStatus(setOrderStatusDto: SetOrderStatusDto) {
    const { orderId, status } = setOrderStatusDto;

    const order = await this.userOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpException("Order: doesn't exist", HttpStatus.BAD_REQUEST);
    }

    order.orderStatus = status;

    return this.userOrderRepository.save(order);
  }
}
