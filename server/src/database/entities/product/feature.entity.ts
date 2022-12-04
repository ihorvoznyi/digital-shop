import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from './product-type.entity';
import { FeatureValue } from './feature-value.entity';

@Entity({ name: 'features' })
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string;

  @Column()
  tag: string;

  @ManyToOne(() => Type, (type) => type.features, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  type: Type;

  @OneToMany(() => FeatureValue, (featureValue) => featureValue.feature)
  featureValues: FeatureValue[];
}
