import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  OrderAddress,
  OrderLine,
  User,
  UserContact,
  UserOrder,
} from '../database/entities';

import { ProductService } from '../product/product.service';

import { CreateOrderDto, CreateOrderLineDto, SetOrderStatusDto } from './dtos';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderLine)
    private orderLineRepository: Repository<OrderLine>,
    @InjectRepository(OrderAddress)
    private orderAddressRepository: Repository<OrderAddress>,
    @InjectRepository(UserOrder)
    private userOrderRepository: Repository<UserOrder>,
    @InjectRepository(UserContact)
    private userContactRepository: Repository<UserContact>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private productService: ProductService
  ) {}

  public async getOrders(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) return [];

    const orders = await this.userOrderRepository.find({
      where: { user },
      relations: [
        'products',
        'products.product',
        'shippingAddress',
        'contactInfo',
      ],
    });

    return orders.map((order) => {
      return OrderService.generateClientOrder(order);
    });
  }

  public async createOrder(dto: CreateOrderDto) {
    const { userId, products, shipping, contact } = dto;

    if (!products.length) {
      throw new HttpException('Order: no products', HttpStatus.BAD_REQUEST);
    }

    const orderTotal: number = products.reduce(
      (cur, prev) => cur + prev.quantity * prev.price,
      0
    );

    let user = null;

    try {
      user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) user = null;
    } catch {
      user = null;
    }

    const shippingAddress = this.orderAddressRepository.create(shipping);

    const contactInfo = this.userContactRepository.create(contact);

    const saveShipping = await this.orderAddressRepository.save(
      shippingAddress
    );
    const saveContact = await this.userContactRepository.save(contactInfo);

    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newOrder = this.userOrderRepository.create({
      orderDate: date.toString(),
      orderTotal,
      orderStatus: 'pending',
      shippingAddress: saveShipping,
      contactInfo: saveContact,
      user: user ? user : null,
    });

    const savedOrder = await this.userOrderRepository.save(newOrder);

    const orderLines: OrderLine[] = [];

    for await (const orderLine of products) {
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

  async setOrderStatus(setOrderStatusDto: SetOrderStatusDto) {
    const { orderId, status } = setOrderStatusDto;

    const order = await this.userOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpException('Order: does not exist', HttpStatus.BAD_REQUEST);
    }

    order.orderStatus = status;

    return this.userOrderRepository.save(order);
  }

  private async createOrderLine(
    orderLineDto: CreateOrderLineDto
  ): Promise<OrderLine> {
    const product = await this.productService.getProduct({
      where: { id: orderLineDto.productId },
    });

    if (!product) {
      throw new HttpException(
        'Order: product does not exist',
        HttpStatus.BAD_REQUEST
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

  private static generateClientOrder(order: UserOrder) {
    const products = order.products.map((product) => product.product);

    return {
      id: order.id,
      date: order.orderDate,
      total: order.orderTotal,
      status: order.orderStatus,
      products,
      contact: {
        name: order.contactInfo.name,
        email: order.contactInfo.email,
        phoneNumber: order.contactInfo.phoneNumber,
      },
      shipping: {
        method: order.shippingAddress.method,
        city: order.shippingAddress.city,
        address: order.shippingAddress.address,
      },
    };
  }
}
