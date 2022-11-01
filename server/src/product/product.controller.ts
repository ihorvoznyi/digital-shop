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
import { FindOneOptions } from 'typeorm';
import { CreateProductDto } from './dtos';
import { IProduct } from './interfaces';
import { UpdateProductDto, AddReviewDto } from './dtos';
import { Product } from '../database/entities';
import { RELATIONS } from '../constants/product.constant';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.getProducts({
      relations: RELATIONS,
    });
  }

  @Get('/type/:id')
  getByFilters(
    @Param('id') typeId: string,
    @Query() filters,
  ): Promise<IProduct[]> {
    if (Object.keys(filters).length) {
      const { priceRange, brands, ...features } = filters;

      const modifyFilters = ProductService.representFilters({
        priceRange,
        brands,
        features,
      });

      return this.productService.filterProduct(typeId, modifyFilters);
    }

    return this.productService.getProducts({
      relations: RELATIONS,
      where: { type: { id: typeId } },
    });
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
