import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../database/entities';
import { TypeModule } from '../type/type.module';
import { BrandModule } from '../brand/brand.module';
import { FeatureModule } from '../feature/feature.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeModule,
    BrandModule,
    FeatureModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
