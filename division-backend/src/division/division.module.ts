import { Module } from '@nestjs/common';
import { DivisionController } from './division.controller';
import { DivisionService } from './division.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Division } from './division';

@Module({
  imports: [TypeOrmModule.forFeature([Division])],
  controllers: [DivisionController],
  providers: [DivisionService],
})
export class DivisionModule { }
