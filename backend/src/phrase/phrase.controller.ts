import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePhraseDto } from './dtos/create-phrase.dto';
import { PhraseService } from './phrase.service';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { RemovePhraseDto } from './dtos/remove-phrase.dto';
import { UpdatePhraseDto } from './dtos/update-phrase.dto';
import { UpdateExampleDto } from './dtos/update-example.dto';
import { CreateExampleDto } from './dtos/create-example.dto';

@Controller('phrases')
export class PhraseController {

  constructor(
    private readonly phrasesService: PhraseService
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
  updatePhrase(@Param('id', ParseIntPipe) id: number, @Body() updatePhraseDto: UpdatePhraseDto) {
    return this.phrasesService.updatePhrase(id, updatePhraseDto);
  }

  @Patch('examples/:id')
  updateExample(@Param('id', ParseIntPipe) id: number, @Body() updateExampleDto: UpdateExampleDto) {
    return this.phrasesService.updateExample(id, updateExampleDto);
  }

  @Post(':pid/examples')
  createExample(@Param('pid', ParseIntPipe) phraseId: number, @Body() createExampleDto: CreateExampleDto) {
    return this.phrasesService.createExample(phraseId, createExampleDto);
  }

  @Delete('examples/:id')
  deleteExample(@Param('id', ParseIntPipe) id: number) {
    return this.phrasesService.deleteExample(id);
  }


}
