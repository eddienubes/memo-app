import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException
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

  private readonly logger: Logger = new Logger('VideoChatGateway');


  constructor(
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
    @InjectRepository(Definition)
    private readonly definitionRepository: Repository<Definition>
  ) {
  }

  findAll(paginationDto: PaginationQueryDto, select: (keyof Phrase)[] = []): Promise<Phrase[]> {
    return this.phraseRepository.find({
      take: paginationDto.limit,
      relations: ['examples', 'definition']
    });
  }

  async create(createPhraseDto: CreatePhraseDto): Promise<Phrase> {
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

    await this.phraseRepository.save(phrase);


    return phrase;
  }

  async findById(id: number): Promise<Phrase> {
    const phrase = await this.phraseRepository.findOne(id, {
      relations: ['examples', 'definition']
    });

    if (!phrase) {
      throw new NotFoundException(`Phrase with id ${id} does not exist!`);
    }

    return phrase;
  }

  async remove(id: number): Promise<Phrase> {
    const phrase = await this.findById(id);
    return this.phraseRepository.remove(phrase);
  }


  async updatePhrase(id: number, updatePhraseDtp: UpdatePhraseDto): Promise<Phrase> {
    const phrase = await this.phraseRepository.findOne(id, {
      relations: ['definition', 'examples']
    });

    if (!phrase) {
      throw new NotFoundException(`Phrase with id ${id} does not exist!`);
    }

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

  async updateExample(exampleId: number, updateExampleDto: UpdateExampleDto) {
    const existingExample = await this.exampleRepository.preload({
      id: exampleId,
      value: updateExampleDto.example
    });


    if (!existingExample) {
      throw new NotFoundException(`Example with id ${exampleId} has not been found!`);
    }

    return this.exampleRepository.save(existingExample);
  }

  async createExample(phraseId: number, createExampleDto: CreateExampleDto) {
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
