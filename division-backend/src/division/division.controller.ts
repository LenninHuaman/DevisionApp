import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DivisionService } from './division.service';
import { FilterDivisionDto } from './dtos/filter-division.dto';
import { DivisionPaginationResponseDto } from './dtos/division-pagination.dto';
import { DivisionItemDto } from './dtos/division-item.dto';
import { DivisionBasicDto } from './dtos/division-basic.dto';
import { CreateDivisionDto } from './dtos/create-division.dto';
import { UpdateDivisionDto } from './dtos/update-division.dto';

@Controller('division')
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) { }


  @Get()
  public async getFilteredDivisions(
    @Query() filter: FilterDivisionDto,
  ): Promise<DivisionPaginationResponseDto> {
    return this.divisionService.getFilteredDivisions(filter);
  }

  @Get(':id/subdivisions')
  public async getSubdivisions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DivisionItemDto[]> {
    return this.divisionService.getAllSubdivisions(id);
  }

  @Get('options/all')
  public async getAllDivisionOptions(): Promise<DivisionBasicDto[]> {
    return this.divisionService.getAllDivisionOptions();
  }

  @Get('options/superiors')
  public async getAllSuperiorDivisionOptions(): Promise<DivisionBasicDto[]> {
    return this.divisionService.getAlSuperiorDivisionsOptions();
  }

  @Get('options/levels')
  public async getAllLevelsOptions(): Promise<number[]> {
    return this.divisionService.getAllLevelsOptions();
  }

  @Post()
  public async createDivision(@Body() dto: CreateDivisionDto): Promise<any> {
    return this.divisionService.createDivision(dto);
  }

  @Put(':id')
  async updateDivision(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDivisionDto,
  ): Promise<any> {
    return this.divisionService.updateDivision(id, dto);
  }

  @Delete(':id')
  async deleteDivision(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.divisionService.deleteDvision(id);
  }
}
