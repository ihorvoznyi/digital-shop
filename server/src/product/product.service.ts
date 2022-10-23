import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TypeService } from '../type/type.service';
import { BrandService } from '../brand/brand.service';
import { FeatureService } from '../feature/feature.service';
import { CreateProductDto } from './dtos';
import { IFeature } from '../feature/interfaces';
import { IProduct } from './interfaces';
import { FeatureValue, Product } from '../database/entities';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private typeService: TypeService,
    private brandService: BrandService,
    private featureService: FeatureService,
  ) {}

  async getProducts(options: FindManyOptions): Promise<IProduct[]> {
    const products = await this.productRepository.find(options);

    return products.map((product) =>
      ProductService.generateClientProduct(product),
    );
  }

  async getProduct(options: FindOneOptions): Promise<IProduct> {
    const product = await this.productRepository.findOne(options);

    if (!product) {
      throw new HttpException("Product doesn't exist", HttpStatus.BAD_REQUEST);
    }

    return ProductService.generateClientProduct(product);
  }

  async createProduct(dto: CreateProductDto): Promise<IProduct> {
    const productType = await this.typeService.getType({
      where: { id: dto.type },
      relations: ['features'],
    });

    const productBrand = await this.brandService.getBrand({
      where: { id: dto.brand },
    });

    const newProduct = this.productRepository.create({
      name: dto.name,
      description: dto.description,
      image: dto.image,
      price: dto.price,
      brand: productBrand,
      type: productType,
    });

    let savedProduct = await this.productRepository.save(newProduct);

    try {
      savedProduct.features =
        await this.featureService.createProductFeatureList({
          type: productType,
          product: savedProduct,
          features: dto.features,
        });

      savedProduct = await this.productRepository.save(savedProduct);

      return ProductService.generateClientProduct(savedProduct);
    } catch {
      await this.productRepository.remove(savedProduct);
      throw new HttpException('Product: server error', HttpStatus.BAD_REQUEST);
    }
  }

  async updateProduct(
    productId: string,
    dto: UpdateProductDto,
  ): Promise<IProduct> {
    const options: FindOneOptions = {
      where: { id: productId },
      relations: ['brand', 'type', 'features', 'features.feature'],
    };
    const product = await this.productRepository.findOne(options);

    if (!product) {
      throw new HttpException("Product doesn't exist", HttpStatus.BAD_REQUEST);
    }

    const { name, description, price, image, features } = dto;

    const updatedFeatures: FeatureValue[] = [];

    for (const item of product.features) {
      const featureValue = features.find(
        (feature) => feature.featureId === item.feature.id,
      ).value;

      const updatedFeature: FeatureValue =
        await this.featureService.updateFeatureValue({
          featureId: item.id,
          value: featureValue,
        });

      updatedFeatures.push(updatedFeature);
    }

    try {
      const updated = await this.productRepository.save({
        ...product,
        name,
        description,
        image,
        price,
        features: updatedFeatures,
      });

      return ProductService.generateClientProduct(updated);
    } catch {
      throw new HttpException('Product: update error', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteProduct(productId): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new HttpException("Product doesn't exist", HttpStatus.BAD_REQUEST);
    }

    return this.productRepository.remove(product);
  }

  static generateClientProduct(product: Product): IProduct {
    const productFeatures: IFeature[] = product.features.map((feature) => {
      return {
        feature: feature.feature.featureName,
        value: feature.value,
      };
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      type: product.type.type,
      brand: product.brand.brand,
      price: product.price,
      features: productFeatures,
    };
  }
}
