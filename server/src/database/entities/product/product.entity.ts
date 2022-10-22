import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from './product-brand.entity';
import { Type } from './product-type.entity';
import { FeatureValue } from './feature-value.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @ManyToOne(() => Brand, {
    onDelete: 'CASCADE',
  })
  brand: Brand;

  @ManyToOne(() => Type, {
    onDelete: 'CASCADE',
  })
  type: Type;

  @OneToMany(() => FeatureValue, (featureValue) => featureValue.product)
  features: FeatureValue[];
}
