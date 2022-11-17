import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../database/entities';
import { FindOneOptions } from 'typeorm';
import { UpdateRoleDto, UpdateUserDto } from './dto';
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

  @Patch('/roles/:id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  changeRole(
    @Param('id') userId: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.userService.changeRole(userId, updateRoleDto);
  }

  @Put(':id')
  updateUser(@Param('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
