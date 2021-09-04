import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';
import { SubscriberService } from './services/subscriber.service';

@Controller('subscriber')
export class SubscriberController {

  constructor(
    private readonly subscriberService: SubscriberService,
  ) {
  }

  @MessagePattern({ cmd: 'add-subscriber' })
  public async addSubscriber(subscriber: CreateSubscriberDto) {
    return this.subscriberService.addSubscriber(subscriber);
  }

  @MessagePattern({ cmd: 'get-all-subscribers' })
  public async getAllSubscriber() {
    console.log('Get all subs');
    return this.subscriberService.getAllSubscribers();
  }
}
