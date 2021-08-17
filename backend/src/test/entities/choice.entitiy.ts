import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Phrase } from '../../phrase/entities/phrase.entity';
import { Answer } from './answer.entity';
import { Test } from './test.entity';

@Entity('choice')
export class Choice {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  userId: number;

  @Column()
  phraseId: number;

  @Column()
  testId: number;

  @Column()
  answerId: number

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

  @ManyToOne(() => Test)
  @JoinColumn({
    name: 'testId'
  })
  test: Test

  @ManyToOne(() => Answer)
  @JoinColumn({
    name: 'answerId'
  })
  answer: Answer
}