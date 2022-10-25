import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Feature, FeatureValue } from '../database/entities';

import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feature, FeatureValue])],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
