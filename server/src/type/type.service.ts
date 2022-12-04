import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Feature, Type } from '../database/entities';
import { CreateTypeDto } from './dtos';
import { FeatureService } from '../feature/feature.service';
import { IClientType, UpdateTypeDto } from './interfaces';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
    private featureService: FeatureService
  ) {}

  async getTypes() {
    const types = await this.typeRepository.find({
      relations: ['features', 'products'],
    });

    if (!types.length) return types;

    return types.map((type) => TypeService.generateClientType(type));
  }

  async getTableTypes() {
    return (await this.typeRepository.find()).map((type) => ({
      id: type.id,
      name: type.type,
    }));
  }

  async getType(id: string): Promise<Type> {
    const type = await this.typeRepository.findOne({
      where: { id },
      relations: ['features'],
    });

    if (!type) {
      throw new HttpException('Type does not exist', HttpStatus.BAD_REQUEST);
    }

    return type;
  }

  async getClientType(id: string): Promise<IClientType> {
    const type = await this.getType(id);

    return TypeService.generateClientType(type);
  }

  async createType(dto: CreateTypeDto): Promise<Type> {
    const { typeName, featureList, tag } = dto;

    const type = await this.typeRepository.findOneBy({ type: typeName });

    if (type) {
      throw new HttpException('Type already exists', HttpStatus.BAD_REQUEST);
    }

    const isValid = this.validate({ tag }) && this.validate({ type: typeName });

    if (!isValid) {
      throw new HttpException('Validation Fail', HttpStatus.BAD_REQUEST);
    }

    const newType = this.typeRepository.create({
      type: typeName,
      tag,
    });
    const savedType = await this.typeRepository.save(newType);

    const typeFeatures: Feature[] = [];

    // Create features which belongs to the type
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

  async validate(options: FindOptionsWhere<Type>): Promise<boolean> {
    const candidate = await this.typeRepository.findOne({ where: options });

    if (candidate) {
      throw new HttpException('Validate Fail', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

  // Find type by id
  // Then update values if they not empty
  async updateType(typeId: string, dto: UpdateTypeDto) {
    const type = await this.typeRepository.findOne({
      where: { id: typeId },
      relations: ['features'],
    });

    if (!type) {
      throw new NotFoundException(`Type #${typeId} not found`);
    }

    const { name, tag, features } = dto;

    if (name) {
      const isValid =
        name === type.type || (await this.validate({ type: name }));

      if (!isValid) {
        throw new HttpException('Validation Error', HttpStatus.BAD_REQUEST);
      }

      type.type = name;
    }
    if (tag) {
      const isValid = tag === type.tag || (await this.validate({ tag }));

      if (!isValid) {
        throw new HttpException('Validation Error', HttpStatus.BAD_REQUEST);
      }

      type.tag = tag;
    }

    // If deleteFeatures is not empty => then delete features

    const updatedFeatures = [];

    for await (const feature of features) {
      if (feature.flag === 'update') {
        const toUpdate = type.features.find((item) => item.id === feature.id);

        toUpdate.name = feature.name;

        updatedFeatures.push(toUpdate);

        continue;
      } else if (feature.flag === 'new') {
        const newFeature = await this.featureService.createFeature({
          type,
          name: feature.name,
        });

        updatedFeatures.push(newFeature);

        continue;
      }
    }

    await this.featureService.deleteInvalidFeatures();

    type.features = [...updatedFeatures];

    const savedType = await this.typeRepository.save(type);

    return TypeService.generateClientType(savedType);
  }

  static generateClientType(type: Type) {
    // Capitalize
    const name = type.type.charAt(0).toUpperCase() + type.type.slice(1);

    const features = type.features.map((feature) => {
      return {
        id: feature.id,
        name: feature.name,
      };
    });

    return {
      id: type.id,
      name,
      tag: type.tag,
      features,
      products: type.products,
    };
  }
}
