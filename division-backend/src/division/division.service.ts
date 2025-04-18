import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './division';
import { Repository } from 'typeorm';
import { CreateDivisionDto } from './dtos/create-division.dto';
import { UpdateDivisionDto } from './dtos/update-division.dto';
import { DivisionBasicDto } from './dtos/division-basic.dto';
import { FilterDivisionDto } from './dtos/filter-division.dto';
import { DivisionPaginationResponseDto } from './dtos/division-pagination.dto';
import { DivisionItemDto } from './dtos/division-item.dto';

@Injectable()
export class DivisionService {
  constructor(
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
  ) { }

  public async getFilteredDivisions(
    filter: FilterDivisionDto,
  ): Promise<DivisionPaginationResponseDto> {
    const {
      superiorIds,
      levelValues,
      divisionIds,
      page = 1,
      limit = 10,
    } = filter;

    const query = this.divisionRepository
      .createQueryBuilder('division')
      .leftJoinAndSelect('division.superior', 'superior')
      .leftJoinAndSelect('division.subs', 'subs');

    if (Array.isArray(superiorIds) && superiorIds.length > 0) {
      query.andWhere('division.superiorId IN (:...superiorIds)', { superiorIds });
    }

    if (Array.isArray(levelValues) && levelValues.length > 0) {
      query.andWhere('division.level IN (:...levelValues)', { levelValues });
    }

    if (Array.isArray(divisionIds) && divisionIds.length > 0) {
      console.log('divisionIds', divisionIds);
      query.andWhere('division.id IN (:...divisionIds)', { divisionIds });
    }

    const [divisions, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data: DivisionItemDto[] = divisions.map((division) => ({
      id: division.id,
      name: division.name,
      superiorName: division.superior?.name ?? null,
      collaborators: division.collaborators,
      level: division.level,
      subsCount: division.subs?.length ?? 0,
      ambassador: division.ambassador ?? null,
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }

  public async getAllSubdivisions(id: number): Promise<DivisionItemDto[]> {
    const division = await this.divisionRepository.findOne({
      where: { id },
      relations: ['subs'],
    });

    if (!division) throw new BadRequestException('Division not found');
    if (division.subs === null) return [];

    const data: DivisionItemDto[] = division.subs!.map((subdivision) => ({
      id: subdivision.id,
      name: subdivision.name,
      superiorName: division.name,
      collaborators: subdivision.collaborators,
      level: subdivision.level,
      ambassador: subdivision.ambassador,
      subsCount: subdivision.subs?.length ?? 0,
    }));

    return data;
  }

  public async getAllDivisionOptions(): Promise<DivisionBasicDto[]> {
    const divisions = await this.divisionRepository.find({
      select: ['id', 'name'],
    });
    return divisions;
  }

  public async getAlSuperiorDivisionsOptions(): Promise<DivisionBasicDto[]> {
    const divisions = await this.divisionRepository
      .createQueryBuilder('division')
      .innerJoin('division.subs', 'sub')
      .select(['division.id', 'division.name'])
      .groupBy('division.id')
      .addGroupBy('division.name')
      .getRawMany();

    return divisions.map((d: Division) => ({
      id: d.id,
      name: d.name,
    }));
  }

  public async getAllLevelsOptions(): Promise<number[]> {
    const levels = await this.divisionRepository
      .createQueryBuilder('division')
      .select('DISTINCT division.level', 'level')
      .orderBy('division.level', 'ASC')
      .getRawMany();

    return levels.map((l: Division) => l.level);
  }

  public async createDivision(dto: CreateDivisionDto): Promise<Division> {
    await this.validateUniqueName(dto.name);
    const superior = await this.divisionRepository.findOne({
      where: { id: dto.superiorId },
    });
    if (!superior) throw new BadRequestException('Superior not found');
    const division = this.divisionRepository.create({
      ...dto,
      level: this.getRandomInt(1, 10),
      collaborators: this.getRandomInt(1, 100),
      superior: superior,
    });
    return await this.divisionRepository.save(division);
  }

  public async updateDivision(
    id: number,
    dto: UpdateDivisionDto,
  ): Promise<Division> {
    const division = await this.divisionRepository.findOne({
      where: { id },
    });

    if (!division) throw new BadRequestException('Division not found');

    if (dto.superiorId !== undefined) {
      if (dto.superiorId === null) {
        division.superior = null;
      } else {
        const superior = await this.divisionRepository.findOne({
          where: { id: dto.superiorId },
        });
        if (!superior) throw new BadRequestException('Superior not found');
        if (await this.hasCircularReference(id, dto.superiorId)) {
          throw new BadRequestException('Circular reference detected');
        }
        division.superior = superior;
      }
    }

    if (dto.name) {
      const exist = await this.divisionRepository.findOne({
        where: { name: dto.name },
      });
      if (exist) throw new BadRequestException('This name already exists');
      division.name = dto.name;
    }

    if (dto.ambassador !== undefined) division.ambassador = dto.ambassador;

    if (dto.level !== undefined) division.level = dto.level;

    if (dto.collaborators !== undefined)
      division.collaborators = dto.collaborators;

    return await this.divisionRepository.save(division);
  }

  public async deleteDvision(id: number): Promise<void> {
    const division = await this.divisionRepository.findOne({
      where: { id },
    });
    if (!division) throw new BadRequestException('Division not found');
    if (division.subs) {
      for (const sub of division.subs) {
        sub.superior = null;
        await this.divisionRepository.save(sub);
      }
    }
    await this.divisionRepository.delete(id);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async hasCircularReference(
    id: number,
    newSuperiorId: number,
  ): Promise<boolean> {
    let superior = await this.divisionRepository.findOne({
      where: { id: newSuperiorId },
      relations: ['superior'],
    });

    while (superior) {
      if (superior.id === id) return true;
      superior = superior.superior ?? null;
    }
    return false;
  }

  private async validateUniqueName(name: string): Promise<void> {
    const exist = await this.divisionRepository.findOne({
      where: { name },
    });

    if (exist) {
      throw new BadRequestException('This name already exists');
    }
  }
  private async validateSuperior(id: number): Promise<Division> {
    const superior = await this.divisionRepository.findOne({
      where: { id },
    });
    if (!superior) {
      throw new BadRequestException('This superior does not exist');
    }
    return superior;
  }
}
