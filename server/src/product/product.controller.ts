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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos';
import { IProduct } from './interfaces';
import { UpdateProductDto, AddReviewDto } from './dtos';
import { Product } from '../database/entities';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // @Get('')
  // getInitialProducts(): Promise<IProduct[]> {
  //   return this.productService.getInitialProducts();
  // }

  @Get('')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 8
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.paginate({
      page,
      limit,
      route: 'http://localhost:8081/products',
    });
  }

  @Get('/type/:id')
  getProducts(
    @Param('id') typeId: string,
    @Query() filters
  ): Promise<IProduct[]> {
    if (Object.keys(filters).length) {
      const modifyFilters = ProductService.representFilters(filters);

      return this.productService.getProducts(typeId, modifyFilters);
    }

    return this.productService.getProducts(typeId, {});
  }

  @Get(':id')
  getProduct(@Param('id') productId: string): Promise<IProduct> {
    return this.productService.getProductForClient(productId);
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
    @Body() updateDto: UpdateProductDto
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
