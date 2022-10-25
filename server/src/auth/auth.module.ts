import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule.register({}), PassportModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
