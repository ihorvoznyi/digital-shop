import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateProductDto } from './dtos';
import { IProduct } from './interfaces';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from '../database/entities';
import { AddReviewDto } from './dtos/add-review.dto';
import { RELATIONS } from '../constants/product.constant';
import { IProductFilter } from './interfaces/product-filter.interface';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@Query() filters: IProductFilter) {
    const options: FindManyOptions = {
      relations: RELATIONS,
      where: {
        brand: { id: filters.brandId },
        type: { id: filters.typeId },
      },
    };

    return this.productService.getProducts(options);
  }

  @Get(':id')
  getProduct(@Param('id') productId: string): Promise<IProduct> {
    const options: FindOneOptions = {
      where: { id: productId },
      relations: RELATIONS,
    };

    return this.productService.getProductForClient(options);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  createProduct(@Body() createProductDto: CreateProductDto): Promise<IProduct> {
    return this.productService.createProduct(createProductDto);
  }

  @Post('/reviews')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  addReview(@Body() reviewDto: AddReviewDto) {
    return this.productService.addReview(reviewDto);
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  updateProduct(
    @Param('id') productId: string,
    @Body() updateDto: UpdateProductDto,
  ): Promise<IProduct> {
    return this.productService.updateProduct(productId, updateDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  deleteProduct(@Param('id') productId: string): Promise<Product> {
    return this.productService.deleteProduct(productId);
  }
}
