import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Like,
  Repository,
  IsNull,
  Not,
  ILike,
} from 'typeorm';

import { TypeService } from '../type/type.service';
import { BrandService } from '../brand/services/brand.service';
import { FeatureService } from '../feature/feature.service';

import {
  CreateProductDto,
  UpdateProductDto,
  AddReviewDto,
  FilterDto,
  SearchProductDto,
} from './dtos';

import { IFeature } from '../feature/interfaces';
import { IProduct, IReview, IFilterQuery, IPaginateProps } from './interfaces';

import { FeatureValue, Product, Review, Type } from '../database/entities';
import { UserService } from '../user/user.service';
import { PRODUCT_RELATIONS } from './constants/product.constant';
import { NumberService } from '../utils/number.service';
import { ProductPaginateDto } from './dtos/product-paginate.dto';
import { TypeProductIterator } from './pattern/iterator.pattern';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @Inject(forwardRef(() => TypeService))
    private typeService: TypeService,
    private brandService: BrandService,
    private featureService: FeatureService,
    private userService: UserService
  ) {}

  public async paginate(query: ProductPaginateDto) {
    const { page, keyword, limit } = query;
    const skip = page * limit;

    const data = await this.productRepository.findAndCount({
      where: { name: Like('%' + keyword + '%') },
      relations: PRODUCT_RELATIONS,
      order: { name: 'DESC' },
      take: limit,
      skip,
    });

    const products = data[0].map((product) => {
      return ProductService.generateClientProduct(product);
    });

    return this.paginateResponse({
      data: [products, data[1]],
      page,
      limit,
    });
  }

  private paginateResponse(props: IPaginateProps) {
    const { data, page, limit } = props;

    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      statusCode: 'success',
      data: [...result],
      count: total,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
    };
  }

  public async getProducts(
    typeId: string,
    filters: FilterDto
  ): Promise<IProduct[]> {
    const options = ProductService.generateFilterOptions(typeId, filters);
    let products = await this.productRepository.find(options);

    if (filters.features && filters.features.length) {
      products = products.filter((product) => {
        // Check if product includes all filter characteristic
        return filters.features.every((tag) => {
          const feature = product.features.find(
            (item) => item.feature.tag === tag.name
          );

          if (!feature) return false;

          return tag.values.includes(feature.value);
        });
      });
    }

    const iterator = this.getIterator(products);

    const clientProducts: IProduct[] = [];

    while (!iterator.hasNext()) {
      const clientProduct = ProductService.generateClientProduct(
        iterator.next()
      );

      clientProducts.push(clientProduct);
    }

    return clientProducts;
  }

  public async getInitialProducts(): Promise<IProduct[]> {
    const options: FindManyOptions = {
      where: { isActive: true },
      relations: PRODUCT_RELATIONS,
      take: 8,
      order: {
        comments: {
          estimate: 'ASC',
        },
      },
    };

    const products = await this.productRepository.find(options);

    return products.map((product) =>
      ProductService.generateClientProduct(product)
    );
  }

  public async getTableProducts() {
    return (await this.productRepository.find()).map((product) => ({
      id: product.id,
      name: product.name,
    }));
  }

  public async getProduct(options: FindOneOptions): Promise<Product> {
    const product = await this.productRepository.findOne(options);

    if (!product) {
      throw new HttpException('Product does not exist', HttpStatus.BAD_REQUEST);
    }

    return product;
  }

  public async getProductForClient(productId: string): Promise<IProduct> {
    const options: FindOneOptions = {
      relations: PRODUCT_RELATIONS,
      where: { id: productId },
    };

    const product = await this.getProduct(options);
    return ProductService.generateClientProduct(product);
  }

  // POST methods
  public async createProduct(dto: CreateProductDto): Promise<IProduct> {
    const productType = await this.typeService.getType(dto.type);

    const productBrand = await this.brandService.getBrand(dto.brand);

    const isValid = await this.validateProduct(dto.name);

    if (!isValid) {
      throw new HttpException('Validation Error', HttpStatus.BAD_REQUEST);
    }

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

      console.log(savedProduct.features);

      return ProductService.generateClientProduct(savedProduct);
    } catch (err) {
      await this.productRepository.remove(savedProduct);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async addReview(addReviewDto: AddReviewDto) {
    const { productId, userId, comment, estimate } = addReviewDto;

    const options: FindOneOptions = {
      where: { id: productId },
      relations: ['comments'],
    };
    const product = await this.productRepository.findOne(options);

    const user = await this.userService.getUser({ id: userId });

    if (!product) {
      throw new HttpException('Product does not exist', HttpStatus.BAD_REQUEST);
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
  public async updateProduct(
    productId: string,
    dto: UpdateProductDto
  ): Promise<IProduct> {
    const options: FindOneOptions = {
      where: { id: productId },
      relations: PRODUCT_RELATIONS,
    };
    const product = await this.productRepository.findOne(options);

    if (!product) {
      throw new HttpException('Product does not exist', HttpStatus.BAD_REQUEST);
    }

    const {
      name,
      description,
      price,
      image,
      brand: brandId,
      features,
      isActive,
    } = dto;

    const isValidName =
      product.name === name || (await this.validateProduct(name));

    if (!isValidName) {
      throw new HttpException('Validation Error', HttpStatus.BAD_REQUEST);
    }

    const brand = await this.brandService.getBrand(brandId);

    const updatedFeatures: FeatureValue[] = [];

    for (const item of product.features) {
      const featureValue = features.find(
        (feature) => feature.id === item.id
      ).value;

      const updatedFeature: FeatureValue =
        await this.featureService.updateFeatureValue({
          id: item.id,
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
        brand,
        isActive: Boolean(isActive),
        features: updatedFeatures,
      });

      return ProductService.generateClientProduct(updated);
    } catch (err) {
      throw new HttpException('Product: update error', HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteProduct(productId: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new HttpException('Product does not exist', HttpStatus.BAD_REQUEST);
    }

    return this.productRepository.remove(product);
  }

  public async deleteProducts(ids: string[]): Promise<Product[]> {
    const deletedList: Product[] = [];

    for await (const id of ids) {
      const product = await this.deleteProduct(id);

      deletedList.push(product);
    }

    return deletedList;
  }

  public async validateProduct(name: string): Promise<boolean> {
    const candidate = await this.productRepository.findOneBy({ name });

    if (candidate) {
      throw new HttpException(
        `Product #${name} is already exists`,
        HttpStatus.BAD_REQUEST
      );
    }

    return true;
  }

  public async searchProduct(dto: SearchProductDto) {
    const { typeId, keyword } = dto;

    let type: Type;

    if (typeId) {
      type = await this.typeService.getType(typeId);
    }

    const options: FindOptionsWhere<Product> = {
      name: ILike('%' + keyword + '%'),
      type: type ? type : Not(IsNull()),
    };

    const products = await this.productRepository.find({
      where: options,
      relations: PRODUCT_RELATIONS,
    });

    return products.map((product) => {
      return ProductService.generateClientProduct(product);
    });
  }

  private getIterator(collection: Product[]): any {
    return new TypeProductIterator(collection);
  }

  private getReverseIterator(collection: Product[]): any {
    return new TypeProductIterator(collection, true);
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
        id: feature.id,
        feature: feature.feature.name,
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
      isActive: product.isActive,
      type: {
        id: product.type.id,
        name: product.type.type,
        tag: product.type.tag,
      },
      brand: {
        id: product.brand.id,
        name: product.brand.brand,
      },
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
      relations: PRODUCT_RELATIONS,
      where: {
        type: { id: typeId },
      },
      order: {
        isActive: 'DESC',
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
