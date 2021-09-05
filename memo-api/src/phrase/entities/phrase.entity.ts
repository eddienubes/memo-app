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
import { Exclude } from 'class-transformer';

export enum PhraseType {
  NOUN = 'NOUN',
  ADVERB = 'ADVERB',
  ADJECTIVE = 'ADJECTIVE',
  VERB = 'VERB',
  GENERAL = 'GENERAL'
}

@Entity('phrase')
@Unique(['value', 'type', 'user'])
export class Phrase {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 1000 })
  value: string;

  @Column({
    type: 'enum',
    enum: PhraseType,
    default: PhraseType.GENERAL
  })
  type: PhraseType

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @OneToOne(() => Definition, definition => definition.phrase)
  definition: Definition;

  @Exclude()
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