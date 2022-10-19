import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'types' })
export class Type {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;
}
