import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../database/entities';

import { UserService } from '../user/user.service';

import { RegistrationDto } from './dtos/registration.dto';
import { LoginDto } from './dtos/login.dto';

import { IAuthReturn } from './interfaces/auth.interface';
import { IClientUser } from './interfaces/client-user.interface';

@Injectable()
export class AuthService {
  readonly secret: string;

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {
    this.secret = this.config.get<string>('JWT_SECRET_KEY');
  }

  // Checks if email is available
  // Hash password
  // Creating JWT using user data
  async registration(dto: RegistrationDto): Promise<IAuthReturn> {
    const { email, phoneNumber, password } = dto;
    const hashPassword = await bcrypt.hash(password, 5);

    const newUser = await this.userService.createUser({
      email,
      phoneNumber,
      password: hashPassword,
    });

    // Generate JWT Token
    const token: string = await this.signToken(newUser);

    const clientUser = AuthService.userForClient(newUser);

    return { token, user: clientUser };
  }

  async login(dto: LoginDto): Promise<IAuthReturn> {
    const user = await this.validateUser({
      email: dto.email,
      password: dto.password,
    });
    const token: string = await this.signToken(user);

    const clientUser = AuthService.userForClient(user);

    return { token, user: clientUser };
  }

  // Function which let user avoid extra authorization
  // *When reload the page etc.*
  async auth(email: string): Promise<IAuthReturn> {
    const user = await this.userService.getUser({
      where: { email },
      relations: ['address'],
    });
    if (!user) throw new UnauthorizedException('Invalid token');
    const token: string = await this.signToken(user);

    const clientUser = AuthService.userForClient(user);

    return { token, user: clientUser };
  }

  // Create JWT Token using user data (email, userId)
  private async signToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const options = {
      secret: this.secret,
      expiresIn: '24h',
    };

    return this.jwtService.sign(payload, options);
  }

  // Checking if login parameters is correct
  private async validateUser({ email, password }): Promise<User> {
    const user = await this.userService.getUser({
      where: { email },
      relations: ['address'],
    });

    if (!user) {
      throw new HttpException('User is not exists.', HttpStatus.BAD_REQUEST);
    }

    const isPasswordEquals: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordEquals) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  static userForClient(user): IClientUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
    };
  }
}
