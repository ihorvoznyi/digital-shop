import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from '../product/product.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column()
  estimate: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product)
  product: Product;
}
