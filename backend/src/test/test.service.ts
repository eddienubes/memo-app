import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { Choice } from './entities/choice.entitiy';
import { CreateTestQueryDto } from './dtos/create-test-query.dto';
import { Phrase } from '../phrase/entities/phrase.entity';
import { PhraseService } from '../phrase/phrase.service';

@Injectable()
export class TestService {
  private readonly MAX_TESTS_AMOUNT: number = 5;

  constructor(
    @InjectRepository(Test)
    private readonly testsRepository: Repository<Test>,
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
    @InjectRepository(Choice)
    private readonly choicesRepository: Repository<Choice>,
    private readonly phrasesService: PhraseService
  ) {
  }

  async findAll(userId: number): Promise<Test[]> {
    const tests = await this.testsRepository.find({
      relations: ['phrase', 'answers', 'phrase.definition', 'answers.definition'],
      where: {
        phrase: { userId }
      }
    });
    return tests;
  }

  async findById(id: number, userId: number): Promise<Test> {
    const test = await this.testsRepository.findOne(id, {
      relations: ['phrase', 'answers', 'phrase.definition', 'answers.definition']
    });

    if (!test) {
      throw new NotFoundException(`Test with id ${id} has not been found!`);
    }

    if (test.phrase.userId !== userId) {
      throw new UnauthorizedException(`You are not allowed to manage this test!`);
    }

    return test;
  }

  async createTests(createTestDto: CreateTestQueryDto, userId: number): Promise<Test[]> {
    const lowRatedPhrases = await this.phrasesService.getLowestRatedPhrasesByType(createTestDto.type);

    let phrases: Phrase[];
    if (lowRatedPhrases.length < this.MAX_TESTS_AMOUNT) {
      phrases = await this.phrasesService.findAll({ limit: this.MAX_TESTS_AMOUNT }, userId);
    }

    if (phrases.length < this.MAX_TESTS_AMOUNT) {
      throw new BadRequestException(`You should create at least 5 phrases of the same type to create a test!`);
    }

    const testsPromises: Promise<Test>[] = phrases.map(async phrase => {
      const wrongPhrases = await this.phrasesService.getRandomPhrasesExceptForId(phrase.id, createTestDto.type);

      const wrongAnswers: Answer[] = wrongPhrases.map(wrongPhrase => {
        const wrongAnswer = new Answer();
        wrongAnswer.definition = wrongPhrase.definition;
        wrongAnswer.valid = false;
        return wrongAnswer;
      });

      const correctAnswer = new Answer();
      correctAnswer.definition = phrase.definition;
      correctAnswer.valid = true;

      const answers = [...wrongAnswers, correctAnswer];

      await this.answersRepository.save(answers);

      const test = new Test();
      test.phrase = phrase;
      test.answers = answers;

      await this.testsRepository.save(test);


      // console.log(wrongAnswers)
      return test;
    });
    const tests = await Promise.all(testsPromises);

    return tests;
  }


}
