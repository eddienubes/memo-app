import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Phrase } from './phrase.entity';

@Entity('definition')
export class Definition {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2000 })
  value: string;


  @OneToOne(() => Phrase, phrase => phrase.definition)
  phrase: Phrase;

}