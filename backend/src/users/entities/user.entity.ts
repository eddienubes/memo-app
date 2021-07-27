import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Phrase } from '../../phrases/entities/phrase.entity';
import { Choice } from '../../tests/entities/choice.entitiy';


@Entity('user')
export class User {

  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 2000 })
  username: string;

  @Column({ length: 2000 })
  password: string;

  @OneToMany(() => Phrase, phrase => phrase.user, {
    onDelete: 'CASCADE',
  })
  phrases: Phrase[]

  @OneToMany(() => Choice, log => log.user)
  choices: Choice[]
}