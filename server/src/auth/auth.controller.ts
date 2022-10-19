import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { RegistrationDto } from './dtos/registration.dto';
import { LoginDto } from './dtos/login.dto';
import { IAuth } from './interfaces/auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/auth')
  auth(@Req() req: Request<IAuth>) {
    return this.authService.auth(req.user['email']);
  }
}