import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Phrase } from './entities/phrase.entity';
import { Repository } from 'typeorm';
import { CreatePhraseDto } from './dtos/create-phrase.dto';
import { Example } from './entities/example.entity';
import { Definition } from './entities/definition.entity';

@Injectable()
export class PhrasesService {
  private readonly logger: Logger = new Logger('VideoChatGateway');

  constructor(
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
    @InjectRepository(Definition)
    private readonly definitionRepository: Repository<Definition>,
  ) {
  }

  async create(createPhraseDto: CreatePhraseDto) {
    const existingPhrase = await this.phraseRepository.findOne({ value: createPhraseDto.phrase });
    this.logger.log(existingPhrase);
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
    phrase.examples = examples;
    phrase.definition = definition;
    phrase.value = createPhraseDto.phrase;

    return await this.phraseRepository.save(phrase);
  }


}
