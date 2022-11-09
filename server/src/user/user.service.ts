import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Address, User } from '../database/entities';
import { SetAddressDto } from './dto/set-address.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['address'] });
  }

  async getUser(options: FindOneOptions): Promise<User> {
    const user = await this.userRepository.findOne(options);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async changeRole(userId: string, updateRoleDto: UpdateRoleDto) {
    const { role } = updateRoleDto;
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('User: does not exist', HttpStatus.BAD_REQUEST);
    }

    user.role = role;

    return this.userRepository.save(user);
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const candidate = await this.userRepository.findOneBy({ email });

    if (candidate) {
      throw new HttpException(
        'User: Email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const newUser = this.userRepository.create(createUserDto);
      return this.userRepository.save(newUser);
    } catch {
      throw new HttpException('User: creating error', HttpStatus.BAD_REQUEST);
    }
  }

  async setAddress(userId: string, address: SetAddressDto): Promise<User> {
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
}
