import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './product-brand.entity';
import { Type } from './product-type.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => Brand)
  brand: Brand;

  @ManyToOne(() => Type)
  type: Type;
}
