import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from './product-type.entity';

@Entity({ name: 'characteristics' })
export class Characteristic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  characteristic: string;

  @ManyToOne(() => Type)
  type: Type;
}
