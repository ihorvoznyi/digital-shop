import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Type } from './product-type.entity';
import { Product } from './product.entity';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @ManyToMany(() => Type, (type) => type.brands)
  types: Type[];

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
