import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Phrase } from '../../phrase/entities/phrase.entity';

@Entity('example')
export class Example {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2000 })
  value: string;

  @ManyToOne(() => Phrase, (phrase) => phrase.examples, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'phraseId',
  })
  phrase: Phrase;
}
