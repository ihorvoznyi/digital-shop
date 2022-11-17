import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature, FeatureValue } from '../database/entities';
import { IFeatureType, IProductFeature } from './interfaces';
import { toCamelCase } from '../utils/general.service';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    @InjectRepository(FeatureValue)
    private featureValueRepository: Repository<FeatureValue>
  ) {}

  async createTypeFeature({ type, name }: IFeatureType): Promise<Feature> {
    const tag = toCamelCase(name);

    const newFeature = this.featureRepository.create({
      type,
      featureName: name,
      tag,
    });

    return this.featureRepository.save(newFeature);
  }

  async createProductFeatureList({
    product,
    type,
    features,
  }: IProductFeature): Promise<FeatureValue[]> {
    const productFeatures: FeatureValue[] = [];

    for await (const featureItem of features) {
      const featureEntity = type.features.find(
        (feature) => feature.id === featureItem.featureId
      );

      try {
        const productFeature = this.featureValueRepository.create({
          value: featureItem.value,
          feature: featureEntity,
          product,
        });

        const savedProductFeature = await this.featureValueRepository.save(
          productFeature
        );

        productFeatures.push(savedProductFeature);
      } catch {
        throw new HttpException(
          'Feature: Wrong options',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    return productFeatures;
  }

  async updateFeatureValue({ featureId, value }): Promise<FeatureValue> {
    const feature = await this.featureValueRepository.findOne({
      where: { id: featureId },
      relations: ['feature'],
    });

    if (!feature) {
      throw new HttpException("Feature: doesn't exist", HttpStatus.BAD_REQUEST);
    }

    feature.value = value;

    return this.featureValueRepository.save(feature);
  }
}
