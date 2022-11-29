import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';

import { RegistrationDto } from './dtos/registration.dto';
import { LoginDto } from './dtos/login.dto';

import { IAuth, IAuthReturn } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  registration(@Body() registrationDto: RegistrationDto): Promise<IAuthReturn> {
    return this.authService.registration(registrationDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<IAuthReturn> {
    return this.authService.login(loginDto);
  }

  @Get('/auth')
  auth(@Req() req: Request<IAuth>): Promise<IAuthReturn> {
    return this.authService.auth(req.user['email']);
  }
}
