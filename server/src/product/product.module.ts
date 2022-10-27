import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, Review } from '../database/entities';

import { TypeModule } from '../type/type.module';
import { BrandModule } from '../brand/brand.module';
import { FeatureModule } from '../feature/feature.module';
import { UserModule } from '../user/user.module';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Review]),
    UserModule,
    TypeModule,
    BrandModule,
    FeatureModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
