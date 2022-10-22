import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TypeService } from './type.service';
import { Type } from '../database/entities';
import { CreateTypeDto } from './dtos';
import { FindOneOptions } from 'typeorm';

@Controller('types')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  getTypes(): Promise<Type[]> {
    return this.typeService.getTypes({ relations: ['features'] });
  }

  @Get(':id')
  getType(@Param('id') typeId: string): Promise<Type> {
    const options: FindOneOptions = {
      where: { id: typeId },
      relations: ['features'],
    };

    return this.typeService.getType(options);
  }

  @Post()
  createType(@Body() createTypeDto: CreateTypeDto): Promise<Type> {
    const { featureList, typeName } = createTypeDto;

    const lowerCaseList = featureList.map((item) => item.toLowerCase());
    const uniqueFeatureList = Array.from(new Set(lowerCaseList));

    return this.typeService.createType({
      typeName: typeName.toLowerCase(),
      featureList: uniqueFeatureList,
    });
  }

  @Delete(':id')
  deleteType(@Param('id') typeId: string): Promise<Type> {
    return this.typeService.deleteType(typeId);
  }
}
