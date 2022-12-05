import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Brand } from '../../database/entities';

import { BrandService } from '../services/brand.service';

import { CreateBrandDto } from '../dtos';

import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';
import { IClientBrand } from '../interfaces';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get('')
  getBrands(): Promise<IClientBrand[]> {
    return this.brandService.getBrands({});
  }

  @Get('/for-table')
  getTableBrands() {
    return this.brandService.getTableBrands();
  }

  @Get(':id')
  getBrand(@Param('id') brandId: string): Promise<Brand> {
    return this.brandService.getBrand(brandId);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  createBrand(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    const { brandName } = createBrandDto;

    return this.brandService.createBrand(brandName.toLowerCase());
  }

  @Post('/validate')
  validate(@Body('name') name: string): Promise<boolean> {
    return this.brandService.validateBrand(name);
  }

  @Put(':id')
  updateBrand(@Param('id') id: string, @Body('name') name: string) {
    return this.brandService.updateBrand(id, name);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  deleteBrand(@Param('id') id: string): Promise<Brand> {
    return this.brandService.deleteBrand(id);
  }
}
