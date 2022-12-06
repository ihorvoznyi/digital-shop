import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { Product, Type } from '../database/entities';
import { FeatureModule } from '../feature/feature.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Type, Product]),
    FeatureModule,
    UserModule,
  ],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService],
})
export class TypeModule {}
