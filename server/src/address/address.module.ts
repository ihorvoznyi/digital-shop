import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, UserAddress } from 'src/database/entities';

import { AddressController } from './address.controller';

import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
