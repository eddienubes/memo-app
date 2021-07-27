import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Phrase } from './entities/phrase.entity';
import { Repository } from 'typeorm';
import { CreatePhraseDto } from './dtos/create-phrase.dto';
import { Example } from './entities/example.entity';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { UpdatePhraseDto } from './dtos/update-phrase.dto';

@Injectable()
export class PhrasesService {
  private readonly logger: Logger = new Logger('VideoChatGateway');

  constructor(
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
  ) {
  }

  findAll(paginationDto: PaginationQueryDto): Promise<Phrase[]> {
    return this.phraseRepository.find({
      take: paginationDto.limit,
      relations: ['examples']
    })
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

    const phrase = new Phrase();
    phrase.examples = examples;
    phrase.definition = createPhraseDto.definition;
    phrase.value = createPhraseDto.phrase;
    phrase.type = createPhraseDto.type;

    return await this.phraseRepository.save(phrase);
  }

  async findById(id: number): Promise<Phrase> {
    const phrase = await this.phraseRepository.findOne(id, {
      relations: ['examples']
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


  async update(id: number, updatePhraseDtp: UpdatePhraseDto): Promise<Phrase> {
    const examples =
      updatePhraseDtp.examples &&
      (await Promise.all(updatePhraseDtp.examples.map(
        async ex => this.preloadExampleByValue(ex)
      )));

    await this.exampleRepository.save(examples || []);

    const phrase = await this.phraseRepository.preload({
      id,
      ...updatePhraseDtp,
      value: updatePhraseDtp.phrase,
      examples
    }); // TODO: Fix previous examples becoming null because of replacement

    if (!phrase) {
      throw new NotFoundException(`Phrase with id ${id} does not exist!`);
    }


    return this.phraseRepository.save(phrase);
  }

  async preloadExampleByValue(value: string): Promise<Example> {
    const example = await this.exampleRepository.findOne({ value });

    if (example) {
      return example;
    }

    return this.exampleRepository.create({ value });
  }
}
