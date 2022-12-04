import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { Brand } from '../database/entities';
import { IClientBrand } from './interfaces';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) {}

  public async getBrands(options: FindManyOptions): Promise<IClientBrand[]> {
    const brands = await this.brandRepository.find(options);

    return brands.map((brand) => {
      return BrandService.generateBrandForClient(brand);
    });
  }

  public async getBrand(brandId: string): Promise<Brand> {
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

  public async getTableBrands() {
    return (await this.brandRepository.find()).map((brand) => ({
      id: brand.id,
      name: brand.brand,
    }));
  }

  public async createBrand(brandName: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ brand: brandName });

    if (brand) {
      throw new HttpException(
        `Brand #${brandName} is already exists`,
        HttpStatus.BAD_REQUEST
      );
    }

    const isValid = await this.validateBrand(brandName);

    if (!isValid) {
      throw new HttpException('Validation Error', HttpStatus.BAD_REQUEST);
    }

    try {
      const newBrand = this.brandRepository.create({ brand: brandName });

      return this.brandRepository.save(newBrand);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public async deleteBrand(brandId: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ id: brandId });

    if (!brand) {
      throw new NotFoundException(`Brand #${brandId} not found`);
    }

    return this.brandRepository.remove(brand);
  }

  public async updateBrand(id: string, name: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ id });

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    brand.brand = name;

    return this.brandRepository.save(brand);
  }

  public async validateBrand(name: string): Promise<boolean> {
    const candidate = await this.brandRepository.findOneBy({
      brand: name.toLocaleLowerCase(),
    });

    if (candidate) {
      throw new HttpException(
        `Brand #${name} is already exists`,
        HttpStatus.BAD_REQUEST
      );
    }

    return true;
  }

  static generateBrandForClient(brand: Brand) {
    return {
      id: brand.id,
      name: brand.brand,
    };
  }
}
