import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_items' })
export class ProductItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantityInStock: number;

  @Column()
  price: number;

  @ManyToOne(() => Product)
  product: Product;
}
