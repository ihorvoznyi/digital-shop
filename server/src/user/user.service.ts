import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { User } from '../database/entities';

import { AuthService } from '../auth/auth.service';

import { CreateUserDto, UpdateRoleDto, UpdateUserDto } from './dtos';

import { IClientUser } from '../auth/interfaces/client-user.interface';
import { ADDRESS_RELATION } from './constants/user.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  public async getUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ADDRESS_RELATION });
  }

  public async getUser(findWhere: FindOptionsWhere<User>): Promise<User> {
    const options: FindOneOptions = {
      where: findWhere,
      relations: ADDRESS_RELATION,
    };

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
      const newUser = this.userRepository.create(createUserDto);
      newUser.userAddresses = null;

      return this.userRepository.save(newUser);
    } catch {
      throw new HttpException('User: creating error', HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUser(userId: string, dto: UpdateUserDto) {
    const { name, email, phoneNumber } = dto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
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

    const savedUser = await this.userRepository.save(user);

    return { user: UserService.userForClient(savedUser), token };
  }

  static userForClient(user: User): IClientUser {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      addresses: user.userAddresses,
    };
  }
}
