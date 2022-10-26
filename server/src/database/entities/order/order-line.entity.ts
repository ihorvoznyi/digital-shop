import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User, UserOrder, Product } from '../';

@Entity({ name: 'order_lines' })
export class OrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => UserOrder)
  order: UserOrder;
}
