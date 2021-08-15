import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateTestQueryDto } from './dtos/create-test-query.dto';
import { TestService } from './test.service';
import { TestRO } from './interfaces/test.interface';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('test')
export class TestController {
  constructor(
    private readonly testsService: TestService
  ) {
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async findAll(@Req() req: IRequestWithUser) {
    return this.testsService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: IRequestWithUser) {
    return this.testsService.findById(id, req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createTests(@Query() createTestDto: CreateTestQueryDto, @Req() req: IRequestWithUser): Promise<TestRO[]> {
    const rawTests = await this.testsService.createTests(createTestDto, req.user.id);

    return rawTests.map(
      test => ({
        id: test.id,
        phrase: {
          id: test.phrase.id,
          value: test.phrase.value,
          type: test.phrase.type,
        },
        answers: test.answers.map(
          answer => ({
            id: answer.id,
            definition: answer.definition.value
          })
        )
      })
    );
  }
}
