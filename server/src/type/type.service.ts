import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Feature, Type } from '../database/entities';

import { FeatureService } from '../feature/feature.service';

import { CreateTypeDto } from './dtos';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
    private featureService: FeatureService
  ) {}

  async getTypes(options: FindManyOptions) {
    const types = await this.typeRepository.find(options);

    if (!types.length) return types;

    return types.map((type) => TypeService.generateClientType(type));
  }

  async getType(typeId: string): Promise<Type> {
    const options: FindOneOptions = {
      where: { id: typeId },
      relations: ['features'],
    };

    const type = await this.typeRepository.findOne(options);

    if (!type) {
      throw new HttpException('Type does not exist', HttpStatus.BAD_REQUEST);
    }

    return type;
  }

  async createType(dto: CreateTypeDto): Promise<Type> {
    const { typeName, featureList, tag } = dto;

    const type = await this.typeRepository.findOneBy({ type: typeName });

    if (type) {
      throw new HttpException('Type already exists', HttpStatus.BAD_REQUEST);
    }

    const newType = this.typeRepository.create({
      type: typeName,
      tag,
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

  async deleteType(typeId: string): Promise<Type> {
    const type = await this.typeRepository.findOneBy({ id: typeId });

    if (!type) {
      throw new HttpException('Type does not exist', HttpStatus.BAD_REQUEST);
    }

    return this.typeRepository.remove(type);
  }

  static generateClientType(type: Type) {
    // Capitalize
    const name = type.type.charAt(0).toUpperCase() + type.type.slice(1);

    return {
      id: type.id,
      name,
      tag: type.tag,
    };
  }
}
