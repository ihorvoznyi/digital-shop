import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { OrderLine } from './order-line.entity';
import { OrderAddress } from './order-address.entity';
import { UserContact } from '../user/user-contact.entity';

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
  @JoinColumn()
  user: User;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  products: OrderLine[];

  @ManyToOne(() => OrderAddress, {
    cascade: true,
  })
  @JoinTable()
  shippingAddress: OrderAddress;

  @ManyToOne(() => UserContact, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  contactInfo: UserContact;
}
