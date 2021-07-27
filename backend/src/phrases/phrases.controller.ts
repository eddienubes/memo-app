import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePhraseDto } from './dtos/create-phrase.dto';
import { PhrasesService } from './phrases.service';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { RemovePhraseDto } from './dtos/remove-phrase.dto';
import { UpdatePhraseDto } from './dtos/update-phrase.dto';
import { UpdatePhraseQueryDto } from './dtos/update-phrase-query.dto';

@Controller('phrases')
export class PhrasesController {

  constructor(
    private readonly phrasesService: PhrasesService
  ) {
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.phrasesService.findAll(paginationQuery);
  }

  @Post()
  create(@Body() createPhraseDto: CreatePhraseDto) {
    return this.phrasesService.create(createPhraseDto);
  }

  @Delete(':id')
  remove(@Param() params: RemovePhraseDto) {
    return this.phrasesService.remove(params.id);
  }

  @Patch(':id')
  update(@Param() updatePhraseQueryDto: UpdatePhraseQueryDto, @Body() updatePhraseDto: UpdatePhraseDto) {
    return this.phrasesService.update(updatePhraseQueryDto.id, updatePhraseDto);
  }
}
