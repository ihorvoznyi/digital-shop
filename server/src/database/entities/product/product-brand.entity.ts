import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from './product-type.entity';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @ManyToMany(() => Type, (type) => type.brands)
  types: Type[];
}
