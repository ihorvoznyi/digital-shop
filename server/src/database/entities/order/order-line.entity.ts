import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrder, Product } from '../';

@Entity({ name: 'order_lines' })
export class OrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  // @ManyToOne(() => User)
  // user: User;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => UserOrder, {
    onDelete: 'CASCADE',
  })
  order: UserOrder;
}
