import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from '../entities/test.entity';
import { Repository } from 'typeorm';
import { Answer } from '../entities/answer.entity';
import { Choice } from '../entities/choice.entitiy';
import { CreateTestQueryDto } from '../dtos/create-test-query.dto';
import { Phrase } from '../../phrase/entities/phrase.entity';
import { PhraseService } from '../../phrase/services/phrase.service';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from '../dtos/create-answer.dto';
import { ChoiceService } from './choice.service';

@Injectable()
export class TestService {
  private readonly MAX_TESTS_AMOUNT: number = 5;

  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    private readonly phraseService: PhraseService,
    private readonly answerService: AnswerService,
    private readonly choiceService: ChoiceService
  ) {
  }

  public async findAll(userId: number, done?: boolean): Promise<Test[]> {
    const tests = await this.testRepository.find({
      join: {
        alias: 'test', innerJoinAndSelect: { // key of the field is our alias
          phrase: 'test.phrase',
          answers: 'test.answers'
        },
      },
      where: qb => {
        qb.where('phrase.userId = :userId', { userId });
        if (done) {
          qb.andWhere('test.done = :done', { done });
        }
      },
    });
    return tests;
  }

  public async findById(id: number, userId: number): Promise<Test> {
    const test = await this.testRepository.findOne(id, {
      relations: ['phrase', 'answers']
    });

    if (!test) {
      throw new NotFoundException(`Test with id ${id} has not been found!`);
    }

    if (test.phrase.userId !== userId) {
      throw new UnauthorizedException(`You are not allowed to manage this test!`);
    }

    return test;
  }

  public async createTests(createTestDto: CreateTestQueryDto, userId: number): Promise<Test[]> {
    const lowRatedPhrases = await this.phraseService.getLowestRatedPhrasesByType(createTestDto.type);

    let phrases: Phrase[];
    if (lowRatedPhrases.length < this.MAX_TESTS_AMOUNT) {
      phrases = await this.phraseService.findAll({ limit: this.MAX_TESTS_AMOUNT }, userId);
    }

    if (phrases.length < this.MAX_TESTS_AMOUNT) {
      throw new BadRequestException(`You should have at least 5 phrases of the same type to create a test!`);
    }

    const testsPromises: Promise<Test>[] = phrases.map(async phrase => {
      const wrongPhrases = await this.phraseService.getRandomPhrasesExceptForId(phrase.id, createTestDto.type);

      const wrongAnswers: CreateAnswerDto[] = wrongPhrases.map(wrongPhrase => {
        const wrongAnswer = new Answer();
        wrongAnswer.definition = wrongPhrase.definition.value;
        wrongAnswer.valid = false;
        return wrongAnswer;
      });

      const correctAnswer = new CreateAnswerDto();
      correctAnswer.definition = phrase.definition.value;
      correctAnswer.valid = true;

      const answersDtos = [...wrongAnswers, correctAnswer];

      const answers = await this.answerService.createAnswers(answersDtos);

      const test = new Test();
      test.phrase = phrase;
      test.answers = answers;

      return this.testRepository.save(test);
    });

    return Promise.all(testsPromises);
  }


  public async answerToTest(testId: number, answerId: number, userId: number): Promise<Answer> {
    const answer = await this.answerService.findAnswerById(testId, answerId, userId);

    const test = await this.findById(testId, userId);

    await this.choiceService.create({
      userId,
      testId,
      phraseId: test.phrase.id,
      answerId: answer.id
    });

    if (!answer.valid) {
      throw new BadRequestException(`Incorrect answer!`);
    }

    if (test.done) {
      throw new BadRequestException(`Test has already been completed!`);
    }

    test.done = true;

    await this.testRepository.save(test);

    return answer;
  }


}
