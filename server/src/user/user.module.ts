import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, User } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
