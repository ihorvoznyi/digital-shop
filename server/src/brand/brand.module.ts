import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../database/entities';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), UserModule],
  providers: [BrandService],
  controllers: [BrandController],
  exports: [BrandService],
})
export class BrandModule {}
