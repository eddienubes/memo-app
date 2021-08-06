import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Test } from './test.entity';
import { Definition } from '../../phrase/entities/definition.entity';

@Entity('answer')
export class Answer {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  valid: boolean;

  @ManyToOne(() => Definition)
  @JoinColumn({
    name: 'definitionId',
  })
  definition: Definition;

  @ManyToOne(() => Test, test => test.answers, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'testId'
  })
  test: Test
}