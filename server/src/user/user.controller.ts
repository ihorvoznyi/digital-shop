import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../database/entities';
import { UpdateRoleDto, UpdateUserDto } from './dtos';
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
    return this.userService.getUser({ id: userId });
  }

  @Patch('/roles/:id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  changeRole(
    @Param('id') userId: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.userService.changeRole(userId, updateRoleDto);
  }

  @Post('/validate-email')
  validateEmail(@Body('email') email: string): Promise<boolean> {
    return this.userService.checkIsAvailable(email);
  }

  @Put(':id')
  updateUser(@Param('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
