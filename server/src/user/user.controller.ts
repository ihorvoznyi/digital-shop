import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAddressDto } from './dtos/create-address.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id/address')
  setAddress(@Param('id') userId, @Body() addressDto: CreateAddressDto) {
    return this.userService.setAddress(userId, addressDto);
  }

  // // // DEV // // //
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
