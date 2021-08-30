import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class PublicFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  key: string;
}