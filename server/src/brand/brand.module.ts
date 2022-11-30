import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Brand } from '../database/entities';

import { UserModule } from '../user/user.module';

<<<<<<< HEAD
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
=======
import { BrandService } from './services/brand.service';

import { BrandController } from './controllers/brand.controller';
>>>>>>> 3537557 (TF-41: Add Order Page, User Cabinet functionality, implement Novaposhta API.)

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), UserModule],
  providers: [BrandService],
  controllers: [BrandController],
  exports: [BrandService],
})
export class BrandModule {}
