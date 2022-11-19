import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserAddress } from 'src/database/entities';

import { CreateAddressDto } from './dtos';
import { ADDRESS_RELATION } from 'src/user/constants/user.constant';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(UserAddress)
    private addressRepository: Repository<UserAddress>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  public async createAddress(
    userId: string,
    dto: CreateAddressDto
  ): Promise<UserAddress> {
    try {
      const newAddress = this.addressRepository.create(dto);

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ADDRESS_RELATION,
      });

      const savedAddress = await this.addressRepository.save(newAddress);

      user.userAddresses.push(savedAddress);

      await this.userRepository.save(user);

      return savedAddress;
    } catch {
      throw new HttpException('Wrong create details', HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteAddress(id: string): Promise<UserAddress> {
    const address = await this.addressRepository.findOneBy({ id });

    if (!address) {
      throw new NotFoundException(`Address #${id} not found`);
    }

    return this.addressRepository.remove(address);
  }
}
