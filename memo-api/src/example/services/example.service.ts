import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Example } from '../entities/example.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExampleDto } from '../dtos/create-example.dto';
import { PhraseService } from '../../phrase/services/phrase.service';
import { UpdateExampleDto } from '../dtos/update-example.dto';
import { Phrase } from '../../phrase/entities/phrase.entity';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
  ) {}

  public async findById(exampleId: number, userId?: number) {
    const existingExample = await this.exampleRepository.findOne({
      relations: ['phrase'],
      where: {
        id: exampleId,
      },
    });

    if (!existingExample) {
      throw new NotFoundException(
        `Example with id ${exampleId} has not been found!`,
      );
    }

    if (!userId) {
      return existingExample;
    }

    if (userId !== existingExample.phrase.userId) {
      throw new UnauthorizedException(
        `You are not allowed to manage this example!`,
      );
    }

    return existingExample;
  }

  public async createExample(
    phrase: Phrase,
    createExampleDto: CreateExampleDto,
  ) {
    const example = new Example();
    example.value = createExampleDto.example;
    example.phrase = phrase;

    return this.exampleRepository.save(example);
  }

  public async updateExample(
    exampleId: number,
    updateExampleDto: UpdateExampleDto,
  ) {
    const existingExample = await this.findById(exampleId);
    existingExample.value = updateExampleDto.example;
    return this.exampleRepository.save(existingExample);
  }

  public async deleteExample(id: number, userId: number) {
    const example = await this.findById(id, userId);
    return this.exampleRepository.remove(example);
  }

  public async createWithoutPhrase(examples: string[]) {
    const examplesToSave = examples.map((example) => {
      const newExample = new Example();
      newExample.value = example;
      return newExample;
    });
    return this.exampleRepository.save(examplesToSave);
  }
}
