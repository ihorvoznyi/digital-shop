import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { Type } from '../database/entities';
import { FeatureModule } from '../feature/feature.module';

@Module({
  imports: [TypeOrmModule.forFeature([Type]), FeatureModule],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService],
})
export class TypeModule {}
