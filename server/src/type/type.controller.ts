import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Type } from '../database/entities';

import { TypeService } from './type.service';

import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

import { CreateTypeDto } from './dtos';

@Controller('types')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  getTypes(): Promise<Type[]> {
    return this.typeService.getTypes({ relations: ['features'] });
  }

  @Get(':id')
  getType(@Param('id') typeId: string): Promise<Type> {
    return this.typeService.getType(typeId);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
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
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  deleteType(@Param('id') typeId: string): Promise<Type> {
    return this.typeService.deleteType(typeId);
  }
}
