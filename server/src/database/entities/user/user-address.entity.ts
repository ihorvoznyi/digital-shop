import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  street: string;

  @Column()
  unitNumber: string;

  @Column()
  postalCode: number;

  @Column()
  city: string;

  @ManyToOne(() => Country)
  @JoinTable()
  country: Country;
}
