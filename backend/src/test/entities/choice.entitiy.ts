import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Phrase } from '../../phrase/entities/phrase.entity';
import { Answer } from './answer.entity';

@Entity('choice')
export class Choice {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => User, user => user.choices, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'userId'
  })
  user: User

  @ManyToOne(() => Phrase)
  @JoinColumn({
    name: 'phraseId'
  })
  phrase: Phrase

  @ManyToOne(() => Answer)
  @JoinColumn({
    name: 'answerId'
  })
  answer: Answer
}