import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from '../entities/subscriber.entity';
import { Repository } from 'typeorm';
import { CreateSubscriberDto } from '../dtos/create-subscriber.dto';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>
  ) {
  }


  public async addSubscriber(subscriber: CreateSubscriberDto) {
    const existingSubscriber = await this.subscriberRepository.findOne({
      email: subscriber.email
    });

    if (existingSubscriber) {
      throw new BadRequestException(`Subscriber with such email already exists`);
    }

    const newSubscriber = await this.subscriberRepository.create(subscriber);

    return this.subscriberRepository.save(newSubscriber);
  }

  public getAllSubscribers() {
    return this.subscriberRepository.find({});
  }
}
