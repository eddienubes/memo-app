import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Test } from './test.entity';
import { Exclude } from 'class-transformer';

@Entity('answer')
export class Answer {

  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ default: false })
  valid: boolean;

  @Column()
  definition: string;

  @Exclude()
  @Column({ nullable: true })
  testId: number;

  @ManyToOne(() => Test, test => test.answers, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'testId'
  })
  test: Test
}