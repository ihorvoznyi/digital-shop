import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TypeService } from '../type/type.service';
import { BrandService } from '../brand/brand.service';
import { FeatureService } from '../feature/feature.service';
import { CreateProductDto } from './dtos';
import { IFeature } from '../feature/interfaces';
import { IProduct, IReview } from './interfaces';
import { FeatureValue, Product, Review } from '../database/entities';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UserService } from '../user/user.service';
import { AddReviewDto } from './dtos/add-review.dto';
import { RELATIONS } from '../constants/product.constant';
import { NumberService } from '../utils/number.service';

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

  async getProducts(options: FindManyOptions) {
    const products = await this.productRepository.find(options);

    return products.map((product) =>
      ProductService.generateClientProduct(product),
    );
  }

  async getProduct(options: FindOneOptions): Promise<Product> {
    const product = await this.productRepository.findOne(options);

    if (!product) {
      throw new HttpException("Product doesn't exist", HttpStatus.BAD_REQUEST);
    }

    return product;
  }

  async getProductForClient(options: FindOneOptions): Promise<IProduct> {
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
      type: product.type.type,
      brand: product.brand.brand,
      price: product.price,
      rating,
      features: productFeatures,
      comments: productComments,
    };
  }
}
