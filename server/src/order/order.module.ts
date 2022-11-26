import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OrderAddress,
  OrderLine,
  User,
  UserContact,
  UserOrder,
} from '../database/entities';

import { ProductModule } from '../product/product.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderLine,
      UserOrder,
      UserContact,
      OrderAddress,
      User,
    ]),
    UserModule,
    ProductModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
