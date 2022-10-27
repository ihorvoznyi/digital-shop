import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../database/entities';
import { RegistrationDto } from './dtos/registration.dto';
import { LoginDto } from './dtos/login.dto';
import { UserRolesEnum } from '../user/enums';
import { IAuthReturn } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  readonly secret;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.secret = this.config.get<string>('JWT_SECRET_KEY');
  }

  // Checks if email is available
  // Hash password
  // Creating JWT using user data
  async registration(dto: RegistrationDto): Promise<IAuthReturn> {
    const { email, phoneNumber, password } = dto;
    const candidate = await this.userRepository.findOneBy({ email });

    if (candidate) {
      throw new HttpException(
        'Email is already taken.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);

    const newUser = await this.userRepository.create({
      email,
      phoneNumber,
      password: hashPassword,
      role: UserRolesEnum.USER,
    });
    await this.userRepository.save(newUser);

    // Generate JWT Token
    const token: string = await this.signToken(newUser);

    return { token, user: newUser };
  }

  async login(dto: LoginDto): Promise<IAuthReturn> {
    const user = await this.validateUser({
      email: dto.email,
      password: dto.password,
    });
    const token: string = await this.signToken(user);

    return { token, user };
  }

  // Function which let user avoid extra authorization
  // *When reload the page etc.*
  async auth(email: string): Promise<IAuthReturn> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Invalid token');
    const token: string = await this.signToken(user);

    return { token, user };
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
    const user = await this.userRepository.findOneBy({ email });

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
}
