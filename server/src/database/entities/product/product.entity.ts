import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from './product-brand.entity';
import { Type } from './product-type.entity';
import { FeatureValue } from './feature-value.entity';
import { Review } from '../user/user-review.entity';

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

  @OneToMany(() => Review, (review) => review.product, {
    cascade: true,
  })
  @JoinColumn()
  comments: Review[];

  @OneToMany(() => FeatureValue, (featureValue) => featureValue.product)
  @JoinColumn()
  features: FeatureValue[];

  @ManyToOne(() => Brand, {
    onDelete: 'CASCADE',
  })
  brand: Brand;

  @ManyToOne(() => Type, {
    onDelete: 'CASCADE',
  })
  type: Type;
}
