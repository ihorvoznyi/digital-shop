import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Feature, Type } from '../database/entities';
import { CreateTypeDto } from './dtos';
import { FeatureService } from '../feature/feature.service';
import { UpdateTypeDto } from './interfaces';

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

  async getTableTypes() {
    return (await this.typeRepository.find()).map((type) => ({
      id: type.id,
      name: type.type,
    }));
  }

  async getType(options: FindOneOptions): Promise<Type> {
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
      const typeFeature = await this.featureService.createFeature({
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

  async updateType(typeId: string, dto: UpdateTypeDto) {
    const type = await this.typeRepository.findOne({
      where: { id: typeId },
      relations: ['features'],
    });

    if (!type) {
      throw new NotFoundException(`Type #${typeId} not found`);
    }

    const { name, tag, updateFeatures, deleteFeatures, newFeatures } = dto;

    if (name) type.type = name;
    if (type.tag) type.tag = tag;

    // If deleteFeatures is not empty => then delete features
    if (deleteFeatures.length) {
      const deleted = await this.featureService.deleteFeatures(deleteFeatures);

      type.features = type.features.filter(
        (feature) => !deleted.includes(feature.id)
      );

      await this.typeRepository.save(type);
    }

    if (updateFeatures.length) {
      const updatedFeatures = await this.featureService.updateFeatures(
        updateFeatures
      );

      type.features = [...updatedFeatures, ...type.features];
    }

    // If newFeatures is not empty => then update features
    if (newFeatures.length) {
      const createdFeatures = await this.featureService.createFeatures(
        type,
        newFeatures
      );

      type.features = [...type.features, ...createdFeatures];
    }

    // Ending
    const savedType = await this.typeRepository.save(type);

    return TypeService.generateClientType(savedType);
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
