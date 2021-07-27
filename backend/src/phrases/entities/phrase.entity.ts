import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Example } from './example.entity';
import { User } from '../../users/entities/user.entity';
import { Test } from '../../tests/entities/test.entity';
import { Choice } from '../../tests/entities/choice.entitiy';

export enum PhraseType {
  NOUN = 'NOUN',
  ADVERB = 'ADVERB',
  ADJECTIVE = 'ADJECTIVE',
  VERB = 'VERB',
  GENERAL = 'GENERAL'
}

@Entity('phrase')
export class Phrase {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 1000, unique: true })
  value: string;

  @Column({
    type: 'enum',
    enum: PhraseType,
    default: PhraseType.GENERAL
  })
  type: PhraseType

  @Index()
  @Column({ length: 2000 })
  definition: string;

  @OneToMany(() => Example, example => example.phrase)
  examples: Example[]

  @ManyToOne(() => User, user => user.phrases, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'userId'
  })
  user: User

  @OneToMany(() => Test, test => test.phrase)
  tests: Test[]

  @OneToMany(() => Choice, log => log.phrase)
  choices: Choice[]
}