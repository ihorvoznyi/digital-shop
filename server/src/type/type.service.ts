import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feature, Type } from '../database/entities';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateTypeDto } from './dtos';
import { FeatureService } from '../feature/feature.service';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
    private featureService: FeatureService,
  ) {}

  async getTypes(options: FindManyOptions): Promise<Type[]> {
    return this.typeRepository.find(options);
  }

  async getType(options: FindOneOptions): Promise<Type> {
    const type = await this.typeRepository.findOne(options);

    if (!type) {
      throw new HttpException("Type doesn't exist", HttpStatus.BAD_REQUEST);
    }

    return type;
  }

  async createType(dto: CreateTypeDto): Promise<Type> {
    const { typeName, featureList } = dto;

    const type = await this.typeRepository.findOneBy({ type: typeName });

    if (type) {
      throw new HttpException('Type already exists', HttpStatus.BAD_REQUEST);
    }

    const newType = this.typeRepository.create({
      type: typeName,
    });
    const savedType = await this.typeRepository.save(newType);

    const typeFeatures: Feature[] = [];

    for await (const item of featureList) {
      const featureName = item.toLowerCase();
      const typeFeature = await this.featureService.createTypeFeature({
        name: featureName,
        type: savedType,
      });

      typeFeatures.push(typeFeature);
    }

    savedType.features = typeFeatures;

    return this.typeRepository.save(savedType);
  }
}
