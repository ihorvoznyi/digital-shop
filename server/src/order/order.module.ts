import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderLine, UserOrder } from '../database/entities';

import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderLine, UserOrder]),
    UserModule,
    ProductModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
