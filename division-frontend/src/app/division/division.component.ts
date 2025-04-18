import { Component, inject } from '@angular/core';
import { DivisionService } from './division.service';
import { map, Observable, of } from 'rxjs';
import { DivisionPaginationDto } from './dtos/division-pagination.dto';
import { FilterDivisionDto } from './dtos/filter-division.dto';
import { DivisionItemDto } from './dtos/division-item.dto';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
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
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<DivisionItemDto> | null;
  sortDirections: NzTableSortOrder[];
  sortable?: boolean;
  filterable?: boolean;
  filterMultiple?: boolean;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn<DivisionItemDto> | null;
}

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
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss'],
})
export class DivisionComponent {
  private divisionService = inject(DivisionService);

  listOfColumns: ColumnItem[] = [
    {
      name: 'División',
      sortOrder: null,
      sortFn: (a: DivisionItemDto, b: DivisionItemDto) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      sortable: true,
      filterable: true,
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: DivisionItemDto) =>
        list.some(name => item.name.includes(name))
    },
    {
      name: 'División Superior',
      sortOrder: null,
      sortFn: (a: DivisionItemDto, b: DivisionItemDto) =>
        (a.superiorName ?? '').localeCompare(b.superiorName ?? ''),
      sortDirections: ['ascend', 'descend', null],
      sortable: true,
      filterable: true,
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: (string | null)[], item: DivisionItemDto) => {
        if (list.includes(null)) return item.superiorName === null;
        return list.some(name => name === item.superiorName);
      }
    },
    {
      name: 'Colaboradores',
      sortOrder: null,
      sortFn: (a: DivisionItemDto, b: DivisionItemDto) => a.collaborators - b.collaborators,
      sortDirections: ['ascend', 'descend', null],
      sortable: true,
      filterable: false
    },
    {
      name: 'Nivel',
      sortOrder: null,
      sortFn: (a: DivisionItemDto, b: DivisionItemDto) => a.level - b.level,
      sortDirections: ['ascend', 'descend', null],
      sortable: true,
      filterable: true,
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (levels: number[], item: DivisionItemDto) =>
        levels.length === 0 ? true : levels.includes(item.level)
    },
    {
      name: 'Subdivisiones',
      sortOrder: null,
      sortFn: (a: DivisionItemDto, b: DivisionItemDto) => a.subsCount - b.subsCount,
      sortDirections: ['ascend', 'descend', null],
      sortable: true,
      filterable: false
    },
    {
      name: 'Embajadores',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      sortable: false,
      filterable: false
    }
  ];

  filters: FilterDivisionDto = { page: 1, limit: 10 };
  currentData: DivisionItemDto[] = [];
  sortedData: DivisionItemDto[] = [];
  activeFilters: Record<string, any[]> = {};
  totalItems = 0;
  divisionsPaginated: Observable<DivisionPaginationDto> = this.loadData();
  viewMode: 'list' | 'tree' = 'list';
  selectedColumn: string | null = null;
  searchText: string = '';
  filteredDivisions: DivisionItemDto[] = [];

  loadData(): Observable<DivisionPaginationDto> {
    return this.divisionService.getFilteredDivisions(this.filters).pipe(
      map((response: DivisionPaginationDto) => {
        this.currentData = [...response.data];
        this.sortedData = [...response.data];
        this.updateDynamicFilters(response.data);
        this.totalItems = response.total;

        if (Object.keys(this.activeFilters).length > 0) {
          this.applyLocalFilters();
        }

        return { ...response, data: this.sortedData };
      })
    );
  }

  private applyLocalFilters(): void {
    this.sortedData = [...this.currentData];

    this.listOfColumns.forEach(column => {
      if (column.filterable && column.filterFn) {
        const activeFilters = this.activeFilters[column.name] || [];
        if (activeFilters.length > 0) {
          this.sortedData = this.sortedData.filter(item =>
            column.filterFn!(activeFilters, item)
          );
        }
      }
    });
  }

  onSortChange(column: ColumnItem, sortOrder: NzTableSortOrder): void {
    this.listOfColumns.forEach(col => {
      col.sortOrder = col.name === column.name ? sortOrder : null;
    });

    if (sortOrder && column.sortFn) {
      this.sortedData = [...this.currentData].sort((a, b) => {
        const result = column.sortFn!(a, b);
        return sortOrder === 'ascend' ? result : -result;
      });
    } else {
      this.sortedData = [...this.currentData];
    }

    this.updatePaginatedData();
  }

  handleFilterChange(filters: any[], column: ColumnItem): void {
    if (!column.filterable || !column.filterFn) return;

    this.activeFilters[column.name] = filters;
    this.applyLocalFilters();
    this.updatePaginatedData();
  }

  filterDivisions(): void {
    if (!this.searchText || !this.selectedColumn) {
      this.filteredDivisions = [...this.currentData];
      return;
    }

    const column = this.listOfColumns.find(c => c.name === this.selectedColumn);
    if (!column) return;

    const searchTerm = this.searchText.toLowerCase();

    this.filteredDivisions = this.currentData.filter(item => {
      const fieldName = this.getFieldNameFromColumn(column.name);
      const value = item[fieldName]?.toString().toLowerCase();
      return value?.includes(searchTerm);
    });
  }

  private getFieldNameFromColumn(columnName: string): keyof DivisionItemDto {
    const columnMap: Record<string, keyof DivisionItemDto> = {
      'División': 'name',
      'División Superior': 'superiorName',
      'Nivel': 'level',
      'Colaboradores': 'collaborators',
      'Subdivisiones': 'subsCount',
      'Embajadores': 'ambassador'
    };

    return columnMap[columnName] || 'name';
  }

  clearSearch(): void {
    this.searchText = '';
    this.selectedColumn = null;
    this.filteredDivisions = [];
  }

  private updatePaginatedData(): void {
    this.divisionsPaginated = of({
      data: this.sortedData,
      total: this.sortedData.length,
      page: this.filters.page || 1,
      limit: this.filters.limit || 10
    });
  }

  private updateDynamicFilters(data: DivisionItemDto[]): void {
    const nameColumn = this.listOfColumns.find(c => c.name === 'División');
    if (nameColumn?.filterable) {
      const uniqueNames = [...new Set(data.map(item => item.name))];
      nameColumn.listOfFilter = uniqueNames.map(name => ({ text: name, value: name }));
    }

    const superiorNameColumn = this.listOfColumns.find(c => c.name === 'División Superior');
    if (superiorNameColumn?.filterable) {
      const uniqueSuperiorNames = [...new Set(data.map(item => item.superiorName))];
      superiorNameColumn.listOfFilter = [
        { text: 'Sin división superior', value: null },
        ...uniqueSuperiorNames
          .filter(name => name !== null)
          .map(name => ({ text: name as string, value: name }))
      ];
    }

    const levelColumn = this.listOfColumns.find(c => c.name === 'Nivel');
    if (levelColumn?.filterable) {
      const uniqueLevels = [...new Set(data.map(item => item.level))].sort();
      levelColumn.listOfFilter = uniqueLevels.map(level => ({
        text: `Nivel ${level}`,
        value: level
      }));
    }
  }

  onPageChange(page: number): void {
    this.filters = { ...this.filters, page };
    this.divisionsPaginated = this.loadData();
  }

  onPageSizeChange(limit: number): void {
    this.filters = { page: 1, limit };
    this.divisionsPaginated = this.loadData();
  }

  getLevelColor(level: number): string {
    const colors = ['green', 'blue', 'orange', 'red'];
    return colors[level - 1] || 'default';
  }

  resetFilters(): void {
    this.filters = { page: 1, limit: 10 };
    this.activeFilters = {};
    this.divisionsPaginated = this.loadData();
  }
}
