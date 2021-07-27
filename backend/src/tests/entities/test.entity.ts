import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Phrase } from '../../phrases/entities/phrase.entity';
import { Answer } from './answer.entity';

@Entity('test')
export class Test {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Phrase, phrase => phrase, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'phraseId'
  })
  phrase: Phrase

  @OneToMany(() => Answer, answer => answer.test)
  answers: Answer[]
}