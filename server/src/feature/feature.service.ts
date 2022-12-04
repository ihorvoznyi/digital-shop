import {
  NotFoundException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Feature, FeatureValue, Type } from '../database/entities';
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

  async createFeature({ type, name }: IFeatureType): Promise<Feature> {
    const tag = toCamelCase(name);

    const newFeature = this.featureRepository.create({
      type,
      name,
      tag,
    });

    return this.featureRepository.save(newFeature);
  }

  async createFeatures(type: Type, names: string[]) {
    const createdFeatures: Feature[] = [];

    for await (const name of names) {
      const tag = toCamelCase(name);
      const newFeature = this.featureRepository.create({
        type,
        name,
        tag,
      });

      const savedFeature = await this.featureRepository.save(newFeature);

      createdFeatures.push(savedFeature);
    }

    return createdFeatures;
  }

  async createProductFeatureList({
    product,
    type,
    features,
  }: IProductFeature): Promise<FeatureValue[]> {
    const productFeatures: FeatureValue[] = [];

    for await (const featureItem of features) {
      const featureEntity = type.features.find(
        (feature) => feature.id === featureItem.id
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

  async deleteFeatures(ids: string[]): Promise<string[]> {
    const deletedFeatures: string[] = [];

    for await (const id of ids) {
      try {
        const feature = await this.featureRepository.findOne({ where: { id } });

        await this.featureRepository.remove(feature);
        deletedFeatures.push(id);
      } catch {
        throw new NotFoundException(`Feature #${id} not found`);
      }
    }

    return deletedFeatures;
  }

  async updateFeatures(features): Promise<Feature[]> {
    const updatedFeatures: Feature[] = [];

    for await (const { id, name } of features) {
      try {
        const feature = await this.featureRepository.findOne({ where: { id } });
        const tag = toCamelCase(name);

        feature.name = name;
        feature.tag = tag;

        const savedFeature = await this.featureRepository.save(feature);

        updatedFeatures.push(savedFeature);
      } catch {
        throw new NotFoundException(`Feature #${id} not found`);
      }
    }

    return updatedFeatures;
  }

  async deleteInvalidFeatures() {
    const invalids = await this.featureRepository.find({
      where: { type: null },
    });

    await this.featureRepository.remove(invalids);
  }

  // Update product feature
  async updateFeatureValue({ id, value }): Promise<FeatureValue> {
    const feature = await this.featureValueRepository.findOne({
      where: { id: id },
      relations: ['feature'],
    });

    if (!feature) {
      throw new HttpException(
        'Feature: does not exist',
        HttpStatus.BAD_REQUEST
      );
    }

    feature.value = value;

    return this.featureValueRepository.save(feature);
  }
}
