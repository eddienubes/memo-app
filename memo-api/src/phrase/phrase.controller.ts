import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePhraseDto } from './dtos/create-phrase.dto';
import { PhraseService } from './services/phrase.service';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { RemovePhraseDto } from './dtos/remove-phrase.dto';
import { UpdatePhraseDto } from './dtos/update-phrase.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { CreateExampleDto } from '../example/dtos/create-example.dto';
import { CacheInterceptor } from '@nestjs/common';

@Controller('phrase')
@UseInterceptors(CacheInterceptor)
export class PhraseController {

  constructor(
    private readonly phrasesService: PhraseService,
  ) {
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.findAll(paginationQuery, req.user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Get('search')
  search(@Query('by') by: string, @Req() req: IRequestWithUser) {
    if (!by) {
      return this.phrasesService.findAll({ limit: undefined }, req.user.id);
    }
    return this.phrasesService.searchForPhrases(by, req.user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Post()
  create(@Body() createPhraseDto: CreatePhraseDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.create(createPhraseDto, req.user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  remove(@Param() params: RemovePhraseDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.remove(params.id, req.user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePhraseDto: UpdatePhraseDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.updatePhrase(id, updatePhraseDto, req.user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Post(':pid/example')
  createExample(@Param('pid', ParseIntPipe) phraseId: number, @Body() createExampleDto: CreateExampleDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.createExample(phraseId, createExampleDto, req.user.id);
  }

}
