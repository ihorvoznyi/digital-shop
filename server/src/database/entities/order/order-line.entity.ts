import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductItem } from '../product/product-item.entity';
import { User } from '../user/user.entity';
import { UserOrder } from './shop-order.entity';

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

  @ManyToOne(() => ProductItem)
  productItem: ProductItem;

  @ManyToOne(() => UserOrder)
  order: UserOrder;
}
