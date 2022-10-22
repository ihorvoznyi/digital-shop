import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateProductDto } from './dtos';
import { IProduct } from './interfaces';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(): Promise<IProduct[]> {
    const options: FindManyOptions = {
      relations: ['features', 'features.feature', 'brand', 'type'],
    };

    return this.productService.getProducts(options);
  }

  @Get(':id')
  getProduct(@Param('id') productId: string): Promise<IProduct> {
    const options: FindOneOptions = {
      where: { id: productId },
      relations: ['features', 'features.feature', 'brand', 'type'],
    };

    return this.productService.getProduct(options);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Promise<IProduct> {
    return this.productService.createProduct(createProductDto);
  }
}
