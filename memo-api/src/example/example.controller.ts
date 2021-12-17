import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { ExampleService } from './services/example.service';
import { UpdateExampleDto } from './dtos/update-example.dto';
import { CreateExampleDto } from './dtos/create-example.dto';
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { JwtTwoFactorGuard } from '../auth/guards/jwt-two-factor-guard.service';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @UseGuards(JwtTwoFactorGuard)
  @Patch(':id')
  updateExample(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExampleDto: UpdateExampleDto,
  ) {
    return this.exampleService.updateExample(id, updateExampleDto);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete(':id')
  deleteExample(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IRequestWithUser,
  ) {
    return this.exampleService.deleteExample(id, req.user.id);
  }
}
