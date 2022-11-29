import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Brand } from '../database/entities';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async getBrands(options: FindManyOptions): Promise<Brand[]> {
    return this.brandRepository.find(options);
  }

  async getBrand(options: FindOneOptions): Promise<Brand> {
    const brand = await this.brandRepository.findOne(options);

    if (!brand) {
      throw new HttpException("Brand doesn't exist", HttpStatus.BAD_REQUEST);
    }

    return brand;
  }

  async createBrand(brandName: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ brand: brandName });

    if (brand) {
      throw new HttpException('Brand already exists', HttpStatus.BAD_REQUEST);
    }

    try {
      const newBrand = this.brandRepository.create({ brand: brandName });

      return this.brandRepository.save(newBrand);
    } catch {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteBrand(brandId: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ id: brandId });

    if (!brand) {
      throw new HttpException("Brand doesn't exist", HttpStatus.BAD_REQUEST);
    }

    return this.brandRepository.remove(brand);
  }
}
