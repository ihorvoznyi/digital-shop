import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feature } from './feature.entity';

@Entity({ name: 'characteristic_values' })
export class CharacteristicValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @ManyToOne(() => Feature)
  @JoinTable()
  feature: Feature;
}
