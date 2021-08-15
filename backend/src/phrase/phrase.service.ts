import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Phrase, PhraseType } from './entities/phrase.entity';
import { Not, Repository } from 'typeorm';
import { CreatePhraseDto } from './dtos/create-phrase.dto';
import { Example } from '../example/entities/example.entity';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { UpdatePhraseDto } from './dtos/update-phrase.dto';
import { UpdateExampleDto } from '../example/dtos/update-example.dto';
import { CreateExampleDto } from '../example/dtos/create-example.dto';
import { Choice } from '../test/entities/choice.entitiy';
import { Answer } from '../test/entities/answer.entity';
import { Definition } from '../definition/entities/definition.entity';
import { ExampleService } from '../example/example.service';
import { DefinitionService } from '../definition/definition.service';

@Injectable()
export class PhraseService {
  private readonly MIN_PHRASES_AMOUNT = 5;

  constructor(
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
    private readonly exampleService: ExampleService,
    private readonly definitionService: DefinitionService
  ) {
  }

  public findAll(paginationDto: PaginationQueryDto, userId: number): Promise<Phrase[]> {
    return this.phraseRepository.find({
      take: paginationDto.limit,
      relations: ['examples', 'definition'],
      where: {
        userId
      }
    });
  }


  public async createExample(phraseId: number, createExampleDto: CreateExampleDto, userId: number) {
    const existingPhrase = await this.findById(phraseId, userId);
    return this.exampleService.createExample(existingPhrase, createExampleDto);
  }

  public async create(createPhraseDto: CreatePhraseDto, userId: number): Promise<Phrase> {
    const existingPhrase = await this.phraseRepository.findOne({
      value: createPhraseDto.phrase,
      type: createPhraseDto.type
    });
    console.log(existingPhrase);
    if (existingPhrase) {
      throw new ConflictException(`Phrase ${createPhraseDto.phrase} already exists!`);
    }

    const examples = await this.exampleService.createWithoutPhrase(createPhraseDto.examples);
    const definition = await this.definitionService.createWithoutPhrase(createPhraseDto.definition);

    const phrase = new Phrase();
    phrase.value = createPhraseDto.phrase;
    phrase.type = createPhraseDto.type;
    phrase.examples = examples;
    phrase.definition = definition;
    phrase.userId = userId;

    return this.phraseRepository.save(phrase);
  }

  public async findById(id: number, userId?: number): Promise<Phrase> {
    const phrase = await this.phraseRepository.findOne(id, {
      relations: ['examples', 'definition']
    });

    if (!phrase) {
      throw new NotFoundException(`Phrase with id ${id} does not exist!`);
    }

    if (!userId) {
      return phrase;
    }

    if (phrase.userId !== userId) {
      throw new UnauthorizedException(`You are not allowed to manage this phrase!`);
    }

    return phrase;
  }

  public async remove(id: number, userId: number): Promise<Phrase> {
    const phrase = await this.findById(id, userId);
    return this.phraseRepository.remove(phrase);
  }


  public async updatePhrase(id: number, updatePhraseDtp: UpdatePhraseDto, userId: number): Promise<Phrase> {
    const phrase = await this.findById(id, userId)

    await this.definitionService.update({
      id: phrase.definition.id,
      value: updatePhraseDtp.definition
    });

    return this.phraseRepository.save({
      ...phrase,
      value: updatePhraseDtp.phrase,
      type: updatePhraseDtp.type
    });
  }

  async getLowestRatedPhrasesByType(type: PhraseType) {
    const phrases = await this.phraseRepository.createQueryBuilder('phraseId')
      .where(qb => {
        const subQuery = qb.subQuery()
          .select('ch."phraseId"')
          .from(Choice, 'ch')
          .innerJoin(Phrase, 'p', 'ch.phraseId = p.id')
          .innerJoin(Answer, 'an', 'ch.answerId = an.id')
          .innerJoin(Definition, 'd', 'd.phraseId = p.id')
          .where(`p.type = :type`, { type })
          .andWhere(`an.valid = true`)
          .groupBy('ch."phraseId"')
          .orderBy('count(ch."phraseId")')
          .limit(5)
          .getQuery();

        return `id IN ` + subQuery;
      })
      .getMany();

    return phrases;
  }

  async getRandomPhrasesExceptForId(excludedId: number, type: PhraseType, limit = 4): Promise<Phrase[]> {
    const count = await this.phraseRepository
      .createQueryBuilder()
      .where(`id != :excludedId`, { excludedId })
      .andWhere(`type = :type`, { type })
      .getCount();

    if (count < this.MIN_PHRASES_AMOUNT - 1) { // Minus the one we exclude
      throw new BadRequestException(`You should have at least 5 phrases of the same type to be able to create a test`);
    }

    let [{ floor: offset }] = await this.phraseRepository
      .query(`SELECT floor(random() * ${count})`);

    // console.log('Before: ', offset);

    const upperPhrasesAmountBoundary = count - (this.MIN_PHRASES_AMOUNT - 1);
    // console.log('Boundary: ', upperPhrasesAmountBoundary);
    if (offset > upperPhrasesAmountBoundary) {
      const pushBackValue = offset - upperPhrasesAmountBoundary;

      offset -= pushBackValue;
    }

    // const phrase = await this.phraseRepository
    //   .createQueryBuilder('phrase')
    //   .innerJoinAndSelect('phrase.definition', 'definition')
    //   .where(`phrase."id" != :excludedId`, { excludedId })
    //   .andWhere(`type = :type`, { type })
    //   .offset(offset)
    //   .limit(limit)
    //   .getMany();
    const phrases = await this.phraseRepository.find({
      relations: ['definition'],
      where: {
        id: Not(excludedId),
        type
      },
      skip: offset,
      take: limit,
    });
    // console.log(phrase);
    return phrases;
  }
}
