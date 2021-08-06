import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Phrase } from '../../phrase/entities/phrase.entity';
import { Choice } from '../../test/entities/choice.entitiy';


@Entity('user')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  email: string;

  @Index()
  @Column({ unique: true })
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