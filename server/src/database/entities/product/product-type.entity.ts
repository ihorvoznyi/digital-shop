import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Feature } from './feature.entity';

@Entity({ name: 'types' })
export class Type {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @OneToMany(() => Feature, (feature) => feature.type, {
    cascade: true,
  })
  features: Feature[];
}
