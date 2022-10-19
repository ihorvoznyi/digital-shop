import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Characteristic } from './product-characteristic.entity';

@Entity({ name: 'characteristic_values' })
export class CharacteristicValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @ManyToOne(() => Characteristic)
  @JoinTable()
  characteristic: Characteristic;
}
