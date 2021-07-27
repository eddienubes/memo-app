import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Test } from './test.entity';
import { Choice } from './choice.entitiy';


@Entity('answer')
export class Answer {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  valid: boolean;

  @ManyToOne(() => Test, test => test.answers, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'testId'
  })
  test: Test

  @OneToMany(() => Choice, log => log.answer)
  choices: Choice[]
}