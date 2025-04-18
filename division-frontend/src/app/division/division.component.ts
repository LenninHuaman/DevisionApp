import { Component, inject, OnInit } from '@angular/core';
import { DivisionService } from './division.service';
import { map, Observable, of } from 'rxjs';
import { DivisionPaginationDto } from './dtos/division-pagination.dto';
import { FilterDivisionDto } from './dtos/filter-division.dto';
import { DivisionItemDto } from './dtos/division-item.dto';
import { DivisionBasicDto } from './dtos/division-basic.dto';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-division',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    CommonModule,
    NzTableModule,
    NzCardModule,
    NzTagModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzTabsModule,
    NzButtonModule,
    NzDropDownModule,
    NzPaginationModule,
  ],
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss'],
})
export class DivisionComponent implements OnInit {
  private divisionService = inject(DivisionService);

  filters: FilterDivisionDto = {
    superiorIds: [],
    levelValues: [],
    divisionIds: [],
    page: 1,
    limit: 10,
  };

  filterOptions = {
    divisions: [] as DivisionBasicDto[],
    superiors: [] as DivisionBasicDto[],
    levels: [] as number[],
  };

  divisionsPaginated: Observable<DivisionPaginationDto> = this.loadData();
  currentData: DivisionItemDto[] = [];

  ngOnInit(): void {
    this.divisionsPaginated.subscribe((res) => {
      this.currentData = res.data;
    });
  }

  loadData(): Observable<DivisionPaginationDto> {
    return this.divisionService.getFilteredDivisions(this.filters);
  }

  divisionOrder: 'ascend' | 'descend' | null = null;;


  sortDivision(order: 'ascend' | 'descend' | null | string): void {
    this.divisionOrder = order as 'ascend' | 'descend' | null;
    if (order) {
      this.currentData = [...this.currentData].sort((a, b) =>
        order === 'ascend'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    } else {
      this.divisionsPaginated.subscribe((res) => {
        this.currentData = res.data;
      });
    }
  }

  onPageChange(page: number): void {
    this.filters = {
      ...this.filters,
      page
    };
    this.divisionsPaginated = this.loadData();
  }

  onPageSizeChange(limit: number): void {
    this.filters.limit = limit;
    this.filters.page = 1;
    this.divisionsPaginated = this.loadData();
  }

  getLevelColor(level: number): string {
    const colors = ['green', 'blue', 'orange', 'red'];
    return colors[level - 1] || 'default';
  }

  resetFilters(): void {
    this.filters = {
      superiorIds: [],
      levelValues: [],
      divisionIds: [],
      page: 1,
      limit: 10,
    };
    this.divisionsPaginated = this.loadData();
  }
}
