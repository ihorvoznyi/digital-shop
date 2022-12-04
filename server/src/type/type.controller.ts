import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TypeService } from './type.service';
import { Type } from '../database/entities';
import { CreateTypeDto, ValidateTypeDto } from './dtos';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { IClientType, UpdateTypeDto } from './interfaces';

@Controller('types')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  getTypes() {
    return this.typeService.getTypes();
  }

  @Get('/for-table')
  getTableTypes() {
    return this.typeService.getTableTypes();
  }

  @Get(':id')
  getType(@Param('id') typeId: string): Promise<IClientType> {
    return this.typeService.getClientType(typeId);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  createType(@Body() createTypeDto: CreateTypeDto): Promise<Type> {
    const { featureList, typeName, tag } = createTypeDto;

    const lowerCaseList = featureList.map((item) => item.toLowerCase());
    const uniqueFeatureList = Array.from(new Set(lowerCaseList));

    return this.typeService.createType({
      typeName: typeName.toLowerCase(),
      tag,
      featureList: uniqueFeatureList,
    });
  }

  @Post('/validate')
  validate(@Body() dto: ValidateTypeDto): Promise<boolean> {
    const value = dto.value.toLocaleLowerCase();

    if (dto.option === 'tag') return this.typeService.validate({ tag: value });
    else return this.typeService.validate({ type: value });
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  deleteType(@Param('id') typeId: string): Promise<Type> {
    return this.typeService.deleteType(typeId);
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  updateType(@Param('id') id: string, @Body() dto: UpdateTypeDto) {
    return this.typeService.updateType(id, dto);
  }
}
