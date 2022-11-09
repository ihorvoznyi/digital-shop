import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { Brand } from '../../database/entities';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) {}

  async getBrands(options: FindManyOptions): Promise<Brand[]> {
    return this.brandRepository.find(options);
  }

  async getBrand(brandId: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new HttpException(
        `Brand #${brandId} not found`,
        HttpStatus.BAD_REQUEST
      );
    }

    return brand;
  }

  async createBrand(brandName: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ brand: brandName });

    if (brand) {
      throw new HttpException(
        `Brand #${brandName} is already exists`,
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const newBrand = this.brandRepository.create({ brand: brandName });

      return this.brandRepository.save(newBrand);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteBrand(brandId: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ id: brandId });

    if (!brand) {
      throw new NotFoundException(`Brand #${brandId} not found`);
    }

    return this.brandRepository.remove(brand);
  }
}
