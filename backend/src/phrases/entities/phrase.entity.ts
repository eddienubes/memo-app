import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Definition } from './definition.entity';
import { Example } from './example.entity';

@Entity('phrase')
export class Phrase {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 1000, unique: true })
  value: string;

  @OneToOne(() => Definition, definition => definition.phrase)
  @JoinColumn()
  definition: Definition

  @OneToMany(() => Example, example => example.phrase)
  examples: Example[]
}