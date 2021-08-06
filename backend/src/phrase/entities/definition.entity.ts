import { PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, Entity } from 'typeorm';
import { Phrase } from './phrase.entity';

@Entity('definition')
export class Definition {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 2000, unique: true })
  value: string;

  @OneToOne(() => Phrase, phrase => phrase.definition, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'phraseId'
  })
  phrase: Phrase;
}