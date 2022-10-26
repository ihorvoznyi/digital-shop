import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateProductDto } from './dtos';
import { IProduct } from './interfaces';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from '../database/entities';
import { AddReviewDto } from './dtos/add-review.dto';
import { RELATIONS } from './constants/product.constant';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(): Promise<IProduct[]> {
    const options: FindManyOptions = {
      relations: RELATIONS,
    };

    return this.productService.getProducts(options);
  }

  @Get(':id')
  getProduct(@Param('id') productId: string): Promise<Product> {
    const options: FindOneOptions = {
      where: { id: productId },
      relations: RELATIONS,
    };

    return this.productService.getProduct(options);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Promise<IProduct> {
    return this.productService.createProduct(createProductDto);
  }

  @Post('/reviews')
  addReview(@Body() reviewDto: AddReviewDto) {
    return this.productService.addReview(reviewDto);
  }

  @Put(':id')
  updateProduct(
    @Param('id') productId: string,
    @Body() updateDto: UpdateProductDto,
  ): Promise<IProduct> {
    return this.productService.updateProduct(productId, updateDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') productId: string): Promise<Product> {
    return this.productService.deleteProduct(productId);
  }
}
