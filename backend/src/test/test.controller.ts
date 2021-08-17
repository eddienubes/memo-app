import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { CreateTestQueryDto } from './dtos/create-test-query.dto';
import { TestService } from './services/test.service';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { Answer } from './entities/answer.entity';
import { Test } from './entities/test.entity';
import { FindTestsQueryDto } from './dtos/find-tests-query.dto';
import { TestInterceptor } from './interceptors/test.interceptor';

@Controller('test')
export class TestController {
  constructor(
    private readonly testsService: TestService
  ) {
  }

  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(TestInterceptor)
  @Get()
  async findAll(@Req() req: IRequestWithUser, @Query() dto: FindTestsQueryDto): Promise<Test[]> {
    return this.testsService.findAll(req.user.id, dto.done);
  }

  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(TestInterceptor)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: IRequestWithUser): Promise<Test> {
    return this.testsService.findById(id, req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(TestInterceptor)
  @Post()
  async createTests(@Query() createTestDto: CreateTestQueryDto, @Req() req: IRequestWithUser): Promise<Test[]> {
    return this.testsService.createTests(createTestDto, req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post(':tid/answer/:aid')
  answerToTest(
    @Param('tid', ParseIntPipe) testId: number, // TODO: Restrict maximum number client can send as an id
    @Param('aid', ParseIntPipe) answerId: number,
    @Req() req: IRequestWithUser
  ): Promise<Answer> {
    return this.testsService.answerToTest(testId, answerId, req.user.id);
  }
}
