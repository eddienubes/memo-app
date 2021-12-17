import {
  Body,
  CacheInterceptor,
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
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { CreateExampleDto } from '../example/dtos/create-example.dto';
import { PhraseType } from './entities/phrase.entity';
import { JwtTwoFactorGuard } from '../auth/guards/jwt-two-factor-guard.service';

@Controller('phrase')
@UseInterceptors(CacheInterceptor)
export class PhraseController {
  constructor(private readonly phrasesService: PhraseService) {}

  @UseGuards(JwtTwoFactorGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.phrasesService.findAll(paginationQuery, req.user.id);
  }

  @Get('type')
  @UseGuards(JwtTwoFactorGuard)
  findTypes() {
    return Object.keys(PhraseType);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('search')
  search(@Query('by') by: string, @Req() req: IRequestWithUser) {
    if (!by) {
      return this.phrasesService.findAll(
        { limit: undefined, offset: undefined },
        req.user.id,
      );
    }
    return this.phrasesService.searchForPhrases(by, req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post()
  create(
    @Body() createPhraseDto: CreatePhraseDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.phrasesService.create(createPhraseDto, req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete(':id')
  remove(@Param() params: RemovePhraseDto, @Req() req: IRequestWithUser) {
    return this.phrasesService.remove(params.id, req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePhraseDto: UpdatePhraseDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.phrasesService.updatePhrase(id, updatePhraseDto, req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post(':pid/example')
  createExample(
    @Param('pid', ParseIntPipe) phraseId: number,
    @Body() createExampleDto: CreateExampleDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.phrasesService.createExample(
      phraseId,
      createExampleDto,
      req.user.id,
    );
  }
}
