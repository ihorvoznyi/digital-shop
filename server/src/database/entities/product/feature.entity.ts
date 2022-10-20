import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from './product-type.entity';

@Entity({ name: 'features' })
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  featureName: string;

  @ManyToOne(() => Type, (type) => type.features)
  type: Type;
}
