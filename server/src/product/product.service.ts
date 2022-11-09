import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm';
import { TypeService } from '../type/type.service';
import { BrandService } from '../brand/brand.service';
import { FeatureService } from '../feature/feature.service';
import {
  CreateProductDto,
  UpdateProductDto,
  AddReviewDto,
  FilterDto,
} from './dtos';
import { IFeature } from '../feature/interfaces';
import { IProduct, IReview } from './interfaces';
import { FeatureValue, Product, Review } from '../database/entities';
import { UserService } from '../user/user.service';
import { RELATIONS } from '../constants/product.constant';
import { NumberService } from '../utils/number.service';
import { IFilterQuery } from './interfaces/product-filter.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private typeService: TypeService,
    private brandService: BrandService,
    private featureService: FeatureService,
    private userService: UserService,
  ) {}

  async getProducts(typeId: string, filters: FilterDto): Promise<IProduct[]> {
    const options = ProductService.generateFilterOptions(typeId, filters);
    let products = await this.productRepository.find(options);

    if (filters.features && filters.features.length) {
      products = products.filter((product) => {
        // Check if product includes all filter characteristic
        return filters.features.every((tag) => {
          const feature = product.features.find(
            (item) => item.feature.tag === tag.name,
          );

          if (!feature) return false;

          return tag.values.includes(feature.value);
        });
      });
    }

    return products.map((product) =>
      ProductService.generateClientProduct(product),
    );
  }

  async getInitialProducts(): Promise<IProduct[]> {
    const options: FindManyOptions = {
      relations: RELATIONS,
      take: 8,
      order: {
        comments: {
          estimate: 'ASC',
        },
      },
    };

    const products = await this.productRepository.find(options);

    return products.map((product) =>
      ProductService.generateClientProduct(product),
    );
  }

  async getProduct(options: FindOneOptions): Promise<Product> {
    const product = await this.productRepository.findOne(options);

    if (!product) {
      throw new HttpException('Product does not exist', HttpStatus.BAD_REQUEST);
    }

    return product;
  }

  async getProductForClient(productId: string): Promise<IProduct> {
    const options: FindOneOptions = {
      relations: RELATIONS,
      where: { id: productId },
    };

    const product = await this.getProduct(options);
    return ProductService.generateClientProduct(product);
  }

  // POST methods
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
      comments: [],
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
    } catch (err) {
      await this.productRepository.remove(savedProduct);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async addReview(addReviewDto: AddReviewDto) {
    const { productId, userId, comment, estimate } = addReviewDto;

    const options: FindOneOptions = {
      where: { id: productId },
      relations: ['comments'],
    };
    const product = await this.productRepository.findOne(options);

    const user = await this.userService.getUser({ where: { id: userId } });

    if (!product) {
      throw new HttpException("Product doesn't exist", HttpStatus.BAD_REQUEST);
    }

    const newReview = this.reviewRepository.create({
      estimate,
      comment,
      user,
      product,
    });

    const savedReview = await this.reviewRepository.save(newReview);

    product.comments = [...product.comments, savedReview];
    await this.productRepository.save(product);

    return savedReview;
  }

  // PUT Methods
  async updateProduct(
    productId: string,
    dto: UpdateProductDto,
  ): Promise<IProduct> {
    const options: FindOneOptions = {
      where: { id: productId },
      relations: RELATIONS,
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
    } catch (err) {
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

  static updateRate(product: Product): number {
    const { comments } = product;
    const size: number = comments.length;
    const rating: number =
      comments.reduce((acc, obj) => acc + obj.estimate, 0) / size;

    return NumberService.round(rating, 1);
  }

  static generateClientProduct(product: Product): IProduct {
    const productFeatures: IFeature[] = product.features.map((feature) => {
      return {
        feature: feature.feature.featureName,
        value: feature.value,
      };
    });

    let productComments: IReview[] = [];
    let rating = 0;

    const isComments = product?.comments && product.comments.length;

    if (isComments) {
      rating = ProductService.updateRate(product);
      productComments = product.comments.map((review) => {
        return {
          author: review.user.email,
          comment: review.comment,
          estimate: review.estimate,
        };
      });
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      type: {
        typeName: product.type.type,
        typeTag: product.type.tag,
      },
      brand: product.brand.brand,
      price: product.price,
      rating,
      features: productFeatures,
      comments: productComments,
    };
  }

  // CHANGE FUNCTION
  // Generate filter options
  static generateFilterOptions(typeId: string, filters: FilterDto) {
    const { priceRange, brands } = filters;

    const options: FindManyOptions = {
      relations: RELATIONS,
      where: {
        type: { id: typeId },
      },
    };

    if (filters) {
      if (priceRange && priceRange.length) {
        options.where = {
          ...options.where,
          price: Between(Math.min(...priceRange), Math.max(...priceRange)),
        };
      }

      if (brands && brands.length) {
        options.where = {
          ...options.where,
          brand: { brand: In(brands) },
        };
      }
    }

    return options;
  }

  static representFilters(filter: IFilterQuery) {
    const { brands, priceRange, ...features } = filter;

    const mapFeatures = [];

    for (const item in features) {
      mapFeatures.push({
        name: item,
        values: features[item].split(','),
      });
    }

    return {
      brands: brands ? brands.split(',') : [],
      priceRange: priceRange
        ? priceRange.split(',').map((price) => +price)
        : [],
      features: mapFeatures,
    };
  }
}
