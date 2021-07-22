import { Body, Controller, Get, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePhraseDto } from './dtos/create-phrase.dto';
import { PhrasesService } from './phrases.service';

@Controller('phrases')
export class PhrasesController {

  constructor(
    private readonly phrasesService: PhrasesService
  ) {

  }

  @Post()
  create(@Body() createPhraseDto: CreatePhraseDto) {
    return this.phrasesService.create(createPhraseDto);
  }
}
