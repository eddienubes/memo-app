import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('privateFile')
export class PrivateFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({
    name: 'ownerId',
  })
  owner: User;
}
