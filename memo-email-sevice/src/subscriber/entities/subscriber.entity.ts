import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;
}