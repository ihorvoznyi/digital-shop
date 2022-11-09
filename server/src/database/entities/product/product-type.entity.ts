import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feature } from './feature.entity';
import { Brand } from './product-brand.entity';
import { Product } from './product.entity';

@Entity({ name: 'types' })
export class Type {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  tag: string;

  @OneToMany(() => Feature, (feature) => feature.type, {
    cascade: true,
  })
  features: Feature[];

  @OneToMany(() => Product, (product) => product.type)
  @JoinColumn()
  products: Product[];

  @ManyToMany(() => Brand, (brand) => brand.types)
  @JoinTable()
  brands: Brand[];
}
