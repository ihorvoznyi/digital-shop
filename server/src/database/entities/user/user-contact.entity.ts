import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'contacts' })
export class UserContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;
}
