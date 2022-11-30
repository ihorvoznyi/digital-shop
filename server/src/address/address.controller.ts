import { Controller, Post, Delete, Body, Param } from '@nestjs/common';

import { UserAddress } from 'src/database/entities';

import { AddressService } from './address.service';

import { CreateAddressDto } from './dtos';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post(':id')
  createAddress(
    @Param('id') userId: string,
    @Body() dto: CreateAddressDto
  ): Promise<UserAddress> {
    return this.addressService.createAddress(userId, dto);
  }

  @Delete(':id')
  deleteAddress(@Param(':id') addressId: string): Promise<UserAddress> {
    return this.addressService.deleteAddress(addressId);
  }
}
