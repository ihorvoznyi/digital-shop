import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address, User } from '../database/entities';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dtos/create-address.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async setAddress(userId, address: CreateAddressDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['address'],
    });

    if (!user)
      throw new HttpException('User is not exists.', HttpStatus.BAD_REQUEST);

    const newAddress = this.addressRepository.create(address);

    user.address = await this.addressRepository.save(newAddress);

    return this.userRepository.save(user);
  }

  // // // DEV // // //
  async getUsers() {
    return this.userRepository.find({ relations: ['address'] });
  }
}
