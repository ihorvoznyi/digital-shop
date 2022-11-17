import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  home: string;

  @Column({ nullable: true })
  postOffice: string;
}
