import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Phrase, PhraseType } from '../../phrase/entities/phrase.entity';
import { Answer } from './answer.entity';

@Entity('test')
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  done: boolean;

  @ManyToOne(() => Phrase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'phraseId',
  })
  phrase: Phrase;

  @OneToMany(() => Answer, (answer) => answer.test)
  answers: Answer[];
}
