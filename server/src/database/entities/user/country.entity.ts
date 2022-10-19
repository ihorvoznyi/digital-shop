import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;
}
