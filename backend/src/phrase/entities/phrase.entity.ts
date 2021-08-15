import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { Example } from '../../example/entities/example.entity';
import { User } from '../../user/entities/user.entity';
import { Definition } from '../../definition/entities/definition.entity';

export enum PhraseType {
  NOUN = 'NOUN',
  ADVERB = 'ADVERB',
  ADJECTIVE = 'ADJECTIVE',
  VERB = 'VERB',
  GENERAL = 'GENERAL'
}

@Entity('phrase')
@Unique(['value', 'type'])
export class Phrase {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 1000, unique: false })
  value: string;

  @Column({
    type: 'enum',
    enum: PhraseType,
    default: PhraseType.GENERAL
  })
  type: PhraseType

  @OneToOne(() => Definition, definition => definition.phrase)
  definition: Definition;

  @OneToMany(() => Example, example => example.phrase)
  examples: Example[]

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, user => user.phrases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
  })
  user: User
}