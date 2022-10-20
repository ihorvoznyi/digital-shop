import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../';
import { UserRolesEnum } from '../../../user/enums';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: UserRolesEnum.USER })
  role: UserRolesEnum;

  @OneToOne(() => Address, {
    nullable: true,
  })
  @JoinColumn()
  address: Address;
}
