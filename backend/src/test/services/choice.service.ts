import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Choice } from '../entities/choice.entitiy';
import { Repository } from 'typeorm';
import { IChoice } from '../dtos/choice.interface';

@Injectable()
export class ChoiceService {
  constructor(
    @InjectRepository(Choice)
    private readonly choiceRepository: Repository<Choice>,
  ) {
  }

  create(choice: IChoice): Promise<Choice> {
    const choiceObj = this.choiceRepository.create(choice);
    return this.choiceRepository.save(choiceObj);
  }
}
