import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feature, Product } from '../';

@Entity({ name: 'characteristic_values' })
export class CharacteristicValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @ManyToOne(() => Feature, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  feature: Feature;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
