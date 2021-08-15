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
import { Example } from './entities/example.entity';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { UpdatePhraseDto } from './dtos/update-phrase.dto';
import { UpdateExampleDto } from './dtos/update-example.dto';
import { CreateExampleDto } from './dtos/create-example.dto';
import { Choice } from '../test/entities/choice.entitiy';
import { Answer } from '../test/entities/answer.entity';
import { Definition } from './entities/definition.entity';

@Injectable()
export class PhraseService {
  private readonly MIN_PHRASES_AMOUNT = 5;

  constructor(
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
    @InjectRepository(Definition)
    private readonly definitionRepository: Repository<Definition>
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

  public async create(createPhraseDto: CreatePhraseDto, userId: number): Promise<Phrase> {
    const existingPhrase = await this.phraseRepository.findOne({ value: createPhraseDto.phrase });

    if (existingPhrase) {
      throw new ConflictException(`Phrase ${createPhraseDto.phrase} already exists!`);
    }

    const examples = createPhraseDto.examples.map(example => {
      const newExample = new Example();
      newExample.value = example;
      return newExample;
    });

    await this.exampleRepository.save(examples);

    const definition = new Definition();
    definition.value = createPhraseDto.definition;

    await this.definitionRepository.save(definition);

    const phrase = new Phrase();
    phrase.value = createPhraseDto.phrase;
    phrase.type = createPhraseDto.type;
    phrase.examples = examples;
    phrase.definition = definition;
    phrase.userId = userId;

    await this.phraseRepository.save(phrase);


    return phrase;
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
      throw new UnauthorizedException(`You are not allowed to delete phrases that do not belong to you!`);
    }

    return phrase;
  }

  public async remove(id: number, userId: number): Promise<Phrase> {
    const phrase = await this.findById(id, userId);
    return this.phraseRepository.remove(phrase);
  }


  public async updatePhrase(id: number, updatePhraseDtp: UpdatePhraseDto, userId: number): Promise<Phrase> {
    const phrase = await this.findById(id, userId)

    const definition = await this.definitionRepository.preload({
      id: phrase.definition.id,
      value: updatePhraseDtp.definition
    });

    if (!definition) {
      throw new NotFoundException(`Cannot update definition, that does not exists for such phrase`);
    }

    await this.definitionRepository.save(definition);

    return this.phraseRepository.save({
      ...phrase,
      value: updatePhraseDtp.phrase,
      type: updatePhraseDtp.type
    });
  }

  public async updateExample(exampleId: number, updateExampleDto: UpdateExampleDto) {
    const existingExample = await this.exampleRepository.preload({
      id: exampleId,
      value: updateExampleDto.example,
    });
    // TODO: Rework this method

    if (!existingExample) {
      throw new NotFoundException(`Example with id ${exampleId} has not been found!`);
    }

    return this.exampleRepository.save(existingExample);
  }

  public async createExample(phraseId: number, createExampleDto: CreateExampleDto) {
    const existingPhrase = await this.phraseRepository.findOne(phraseId);

    if (!existingPhrase) {
      throw new NotFoundException(`Phrase with id ${phraseId} has not been found!`);
    }

    const example = new Example();
    example.value = createExampleDto.example;
    example.phrase = existingPhrase;

    return this.exampleRepository.save(example);
  }

  async deleteExample(id: number) {
    const example = await this.exampleRepository.findOne(id);
    if (!example) {
      throw new NotFoundException(`Example with id ${id} has not been found!`);
    }

    return this.exampleRepository.remove(example);
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
