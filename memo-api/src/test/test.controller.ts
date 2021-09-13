import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Get,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { CreateTestQueryDto } from './dtos/create-test-query.dto';
import { TestService } from './services/test.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { Answer } from './entities/answer.entity';
import { Test } from './entities/test.entity';
import { FindTestsQueryDto } from './dtos/find-tests-query.dto';
import { CleanupInterceptor } from '../common/interceptors/cleanup.interceptor';

@Controller('test')
export class TestController {
  constructor(
    private readonly testsService: TestService
  ) {
  }

  @UseGuards(JwtAccessGuard)
  @UseInterceptors(CleanupInterceptor)
  @Get()
  async findAll(@Req() req: IRequestWithUser, @Query() dto: FindTestsQueryDto): Promise<Test[]> {
    console.log(dto);
    return this.testsService.findAll(req.user.id, dto.done);
  }

  @UseGuards(JwtAccessGuard)
  @UseInterceptors(CleanupInterceptor)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: IRequestWithUser): Promise<Test> {
    return this.testsService.findById(id, req.user.id);
  }

  @UseGuards(JwtAccessGuard)
  @UseInterceptors(CleanupInterceptor)
  @Post()
  async createTests(@Query() createTestDto: CreateTestQueryDto, @Req() req: IRequestWithUser): Promise<Test[]> {
    return this.testsService.createTests(createTestDto, req.user.id); // TODO: Mask answers' IDs
  }

  @UseGuards(JwtAccessGuard)
  @Post(':tid/answer/:aid')
  answerToTest(
    @Param('tid', ParseIntPipe) testId: number, // TODO: Restrict maximum number client can send as an id
    @Param('aid', ParseIntPipe) answerId: number,
    @Req() req: IRequestWithUser
  ): Promise<Answer> {
    return this.testsService.answerToTest(testId, answerId, req.user.id);
  }
}
