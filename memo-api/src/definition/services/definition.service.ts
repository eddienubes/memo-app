import { Injectable, NotFoundException } from '@nestjs/common';
import { Definition } from '../entities/definition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class DefinitionService {
  constructor(
    @InjectRepository(Definition)
    private readonly definitionRepository: Repository<Definition>,
  ) {}

  public async update(definition: DeepPartial<Definition>) {
    const definitionPreload = await this.definitionRepository.preload(
      definition,
    );

    if (!definitionPreload) {
      throw new NotFoundException(
        `Cannot update definition, that does not exists for such phrase`,
      );
    }

    return this.definitionRepository.save(definitionPreload);
  }

  public createWithoutPhrase(value: string) {
    const definition = new Definition();
    definition.value = value;

    return this.definitionRepository.save(definition);
  }
}
