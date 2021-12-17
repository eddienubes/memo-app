import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Phrase } from '../../phrase/entities/phrase.entity';
import { Choice } from '../../test/entities/choice.entitiy';
import { Exclude } from 'class-transformer';
import { PublicFile } from '../../file/entities/public-file.entity';
import { PrivateFile } from '../../file/entities/private-file.entity';

export enum Roles {
  ADMIN = 'ADMIN',
  PUBLIC = 'PUBLIC',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  email: string;

  @Index()
  @Column({ unique: false })
  username: string;

  @Exclude()
  @Column({ length: 2000, nullable: true })
  password?: string;

  @OneToMany(() => Phrase, (phrase) => phrase.user, {
    onDelete: 'CASCADE',
  })
  phrases: Phrase[];

  @OneToMany(() => Choice, (log) => log.user, {
    onDelete: 'CASCADE', // Changed
  })
  choices: Choice[];

  @OneToOne(() => PublicFile, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  avatar?: PublicFile;

  @OneToMany(() => PrivateFile, (privateFile) => privateFile.owner)
  files: PrivateFile[];

  @Column({
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ default: false })
  isRegisteredWithGoogle: boolean;

  @Column({ nullable: true })
  googleAvatar?: string;

  @Exclude()
  @Column({ nullable: true })
  twoFactorAuthSecret: string;

  @Column({ default: false })
  isTwoFactorAuthEnabled: boolean;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({
    type: 'enum',
    enum: Roles,
    default: [Roles.PUBLIC],
    array: true,
  })
  roles: Roles[];
}
