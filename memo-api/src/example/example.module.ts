import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './services/example.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from './entities/example.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}
