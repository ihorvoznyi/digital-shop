import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SetAddressDto } from './dto/set-address.dto';
import { User } from '../database/entities';
import { FindOneOptions } from 'typeorm';

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
}
