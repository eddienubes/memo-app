import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publicFile')
export class PublicFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  key: string;
}
