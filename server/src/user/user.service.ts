import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { Address, User } from '../database/entities';

import { AuthService } from '../auth/auth.service';

import { CreateUserDto, UpdateRoleDto, UpdateUserDto } from './dto';

import { IClientUser } from '../auth/interfaces/client-user.interface';
import { IAddress } from './interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  public async getUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['address'] });
  }

  public async getUser(options: FindOneOptions): Promise<User> {
    const user = await this.userRepository.findOne(options);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async changeRole(userId: string, updateRoleDto: UpdateRoleDto) {
    const { role } = updateRoleDto;
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('User: does not exist', HttpStatus.BAD_REQUEST);
    }

    user.role = role;

    return this.userRepository.save(user);
  }

  public async checkIsAvailable(email: string): Promise<boolean> {
    const candidate = await this.userRepository.findOneBy({ email });

    if (candidate) {
      throw new HttpException(
        `Email #${email} is already taken`,
        HttpStatus.BAD_REQUEST
      );
    }

    return true;
  }

  public async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const candidate = await this.userRepository.findOneBy({ email });

    if (candidate) {
      throw new HttpException(
        'User: Email already exist',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      let addressInfo = this.addressRepository.create();
      addressInfo = await this.addressRepository.save(addressInfo);

      const newUser = this.userRepository.create(createUserDto);
      newUser.address = addressInfo;

      return this.userRepository.save(newUser);
    } catch {
      throw new HttpException('User: creating error', HttpStatus.BAD_REQUEST);
    }
  }

  // FINISH Function
  public async updateAddress(address: IAddress): Promise<IAddress> {
    const { id, city, postOffice, home } = address;
    const userAddress = await this.addressRepository.findOneBy({ id });

    userAddress.city = city;
    userAddress.home = home;
    userAddress.postOffice = postOffice;

    return this.addressRepository.save(userAddress);
  }

  public async updateUser(userId: string, dto: UpdateUserDto) {
    const { name, email, phoneNumber, address } = dto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['address'],
    });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    let token = null;

    if (user.email !== email) {
      const candidate = await this.userRepository.findOneBy({ email });

      if (candidate) {
        throw new HttpException(
          'Email is already exist',
          HttpStatus.BAD_REQUEST
        );
      }

      user.email = email;
      token = await this.authService.signToken({ ...user, email });
    }

    if (user.name !== name) user.name = name;
    if (user.phoneNumber !== phoneNumber) user.phoneNumber = phoneNumber;

    const userAddressValues = Object.values(user.address);
    const updateAddressValues = Object.values(address);

    if (
      updateAddressValues.every((value) => userAddressValues.includes(value))
    ) {
      user.address = await this.updateAddress({
        ...address,
        id: user.address.id,
      });
    }

    const savedUser = await this.userRepository.save(user);

    return { user: UserService.userForClient(savedUser), token };
  }

  static userForClient(user): IClientUser {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    };
  }
}
