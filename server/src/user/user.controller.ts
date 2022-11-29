import { Body, Controller, Param, Post } from '@nestjs/common';

import { User } from '../database/entities';

import { UserService } from './user.service';

import { SetAddressDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/address/:id')
  setAddress(
    @Param('id') userId: string,
    @Body() addressDto: SetAddressDto,
  ): Promise<User> {
    return this.userService.setAddress(userId, addressDto);
  }
}
