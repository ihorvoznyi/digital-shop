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

import { Product } from '../database/entities';

import { ProductService } from './product.service';

import { CreateProductDto } from './dtos';
import { UpdateProductDto, AddReviewDto } from './dtos';

import { IProduct } from './interfaces';

import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  async getAll() {
    return this.productService.getInitialProducts();
  }

  @Get('/paginated')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 8,
    @Query('keyword') keyword = ''
  ) {
    return this.productService.paginate({
      page,
      limit,
      keyword,
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

  @Get('/for-table')
  getTableProducts() {
    return this.productService.getTableProducts();
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

  @Post('/validate')
  validate(@Body('name') name: string): Promise<boolean> {
    return this.productService.validateProduct(name);
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

  // @Post('/upload/:id')
  // @UseGuards(RoleGuard)
  // @Roles(RoleEnum.ADMIN)
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './static',
  //       filename: (req, file, callback) => {
  //         if (!file) return;

  //         const suffix = Date.now() + '-' + 'filename';
  //         // const id = req.url.split('/').slice(-1)[0];

  //         const ext = extname(file.originalname);
  //         const filename = `${suffix}${ext}`;

  //         callback(null, filename);
  //       },
  //     }),
  //   })
  // )
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) return;

  //   const path = 'C:/Cloud/Programming/Projects/digital-shop/server/static/';

  //   return 'file:///' + path + file.filename;
  // }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  deleteProduct(@Param('id') productId: string): Promise<Product> {
    return this.productService.deleteProduct(productId);
  }

  @Delete()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  deleteProducts(@Body('ids') ids: string[]) {
    return this.productService.deleteProducts(ids);
  }
}
