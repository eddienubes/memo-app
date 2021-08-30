import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Phrase } from '../../phrase/entities/phrase.entity';
import { Choice } from '../../test/entities/choice.entitiy';
import { Exclude } from 'class-transformer';
import { PublicFile } from '../../file/entities/public-file.entity';
import { PrivateFile } from '../../file/entities/private-file.entity';


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

  @Exclude()
  @Column({ length: 2000 })
  password: string;

  @OneToMany(() => Phrase, phrase => phrase.user, {
    onDelete: 'CASCADE',
  })
  phrases: Phrase[]

  @OneToMany(() => Choice, log => log.user)
  choices: Choice[]

  @OneToOne(() => PublicFile, {
    nullable: true,
    eager: true
  })
  @JoinColumn()
  avatar?: PublicFile


  @OneToMany(() => PrivateFile, privateFile => privateFile.owner)
  files: PrivateFile[]
}