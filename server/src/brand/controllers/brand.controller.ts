import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Brand } from '../../database/entities';

import { BrandService } from '../services/brand.service';

import { CreateBrandDto } from '../dtos';

import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get(':id')
  getBrand(@Param('id') brandId: string): Promise<Brand> {
    return this.brandService.getBrand(brandId);
  }

  @Get()
  getBrands(): Promise<Brand[]> {
    return this.brandService.getBrands({});
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  createBrand(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    const { brandName } = createBrandDto;

    return this.brandService.createBrand(brandName.toLowerCase());
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  deleteBrand(@Param('id') brandId: string): Promise<Brand> {
    return this.brandService.deleteBrand(brandId);
  }
}
