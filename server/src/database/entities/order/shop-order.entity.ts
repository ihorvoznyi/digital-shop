import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Address } from '../user/user-address.entity';

@Entity({ name: 'orders' })
export class UserOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderDate: Date;

  @Column()
  orderTotal: number;

  @Column()
  orderStatus: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Address)
  @JoinTable()
  shippingAddress: Address;
}
