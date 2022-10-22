import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { Brand } from '../database/entities';
import { CreateBrandDto } from './dtos';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get(':id')
  getBrand(@Param('id') brandId: string): Promise<Brand> {
    return this.brandService.getBrand({ where: { id: brandId } });
  }

  @Get()
  getBrands(): Promise<Brand[]> {
    return this.brandService.getBrands({});
  }

  @Post()
  createBrand(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    const { brandName } = createBrandDto;

    return this.brandService.createBrand(brandName.toLowerCase());
  }
}
