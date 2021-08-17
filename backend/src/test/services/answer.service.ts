import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../entities/answer.entity';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from '../dtos/create-answer.dto';


@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>
  ) {
  }

  public async createAnswers(createAnswerDto: CreateAnswerDto[]) {
    const answers = this.answerRepository.create(createAnswerDto);
    return this.answerRepository.save(answers);
  }

  public async findAnswerById(testId: number, answerId: number, userId?: number): Promise<Answer> {
    const answer = await this.answerRepository.findOne({
      id: answerId,
    }, {
      relations: ['test', 'test.phrase'],
    });

    if (!answer) {
      throw new NotFoundException(`Answer with id ${answerId} for test ${testId} was not found!`);
    }

    if (!userId) {
      return answer;
    }

    if (answer.test.phrase.userId !== userId) {
      throw new UnauthorizedException(`You are not allowed to manage this answer!`);
    }

    return answer;
  }
}