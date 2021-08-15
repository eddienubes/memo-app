import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTestQueryDto } from './dtos/create-test-query.dto';
import { TestService } from './test.service';
import { TestRO } from './interfaces/test.interface';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';

@Controller('test')
export class TestController {
  constructor(
    private readonly testsService: TestService
  ) {
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testsService.findOne(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createTests(@Query() createTestDto: CreateTestQueryDto): Promise<TestRO[]> {
    const rawTests = await this.testsService.createTests(createTestDto);

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
