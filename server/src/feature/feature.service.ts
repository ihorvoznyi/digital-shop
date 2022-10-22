import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feature, FeatureValue } from '../database/entities';
import { Repository } from 'typeorm';
import { IFeatureType } from './interfaces';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    @InjectRepository(FeatureValue)
    private featureValueRepository: Repository<FeatureValue>,
  ) {}

  async createTypeFeature({ type, name }: IFeatureType): Promise<Feature> {
    const newFeature = this.featureRepository.create({
      type,
      featureName: name,
    });

    return this.featureRepository.save(newFeature);
  }
}
