import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SetAddressDto } from './dto/set-address.dto';
import { User } from '../database/entities';
import { FindOneOptions } from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') userId: string): Promise<User> {
    const options: FindOneOptions = {
      where: { id: userId },
    };
    return this.userService.getUser(options);
  }

  @Post('/address/:id')
  setAddress(
    @Param('id') userId: string,
    @Body() addressDto: SetAddressDto,
  ): Promise<User> {
    return this.userService.setAddress(userId, addressDto);
  }

  @Patch('/roles/:id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  changeRole(
    @Param('id') userId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.userService.changeRole(userId, updateRoleDto);
  }
}
