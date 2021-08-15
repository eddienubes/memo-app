import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePhraseDto } from './dtos/create-phrase.dto';
import { PhraseService } from './phrase.service';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { RemovePhraseDto } from './dtos/remove-phrase.dto';
import { UpdatePhraseDto } from './dtos/update-phrase.dto';
import { UpdateExampleDto } from './dtos/update-example.dto';
import { CreateExampleDto } from './dtos/create-example.dto';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('phrases')
export class PhraseController {

  constructor(
    private readonly phrasesService: PhraseService
  ) {
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.findAll(paginationQuery, req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createPhraseDto: CreatePhraseDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.create(createPhraseDto, req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  remove(@Param() params: RemovePhraseDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.remove(params.id, req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  updatePhrase(@Param('id', ParseIntPipe) id: number, @Body() updatePhraseDto: UpdatePhraseDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.updatePhrase(id, updatePhraseDto, req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('examples/:id')
  updateExample(@Param('id', ParseIntPipe) id: number, @Body() updateExampleDto: UpdateExampleDto) {
    return this.phrasesService.updateExample(id, updateExampleDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post(':pid/examples')
  createExample(@Param('pid', ParseIntPipe) phraseId: number, @Body() createExampleDto: CreateExampleDto) {
    return this.phrasesService.createExample(phraseId, createExampleDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete('examples/:id')
  deleteExample(@Param('id', ParseIntPipe) id: number) {
    return this.phrasesService.deleteExample(id);
  }


}
