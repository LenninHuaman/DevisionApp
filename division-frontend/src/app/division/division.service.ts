import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'ng-zorro-antd/core/environments';
import { Observable } from 'rxjs';
import { DivisionItemDto } from './dtos/division-item.dto';
import { DivisionBasicDto } from './dtos/division-basic.dto';
import { FilterDivisionDto } from './dtos/filter-division.dto';
import { DivisionPaginationDto } from './dtos/division-pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {
  private apiUrl = `http://localhost:3000/division`;

  constructor(private http: HttpClient) { }

  getFilteredDivisions(filter: FilterDivisionDto): Observable<DivisionPaginationDto> {
    let params = new HttpParams();

    if (filter.superiorIds) {
      params = params.set('superiorIds', filter.superiorIds.join(','));
    }
    if (filter.levelValues) {
      params = params.set('levelValues', filter.levelValues.join(','));
    }
    if (filter.divisionIds) {
      params = params.set('divisionIds', filter.divisionIds.join(','));
    }
    if (filter.page) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.limit) {
      params = params.set('limit', filter.limit.toString());
    }

    return this.http.get<DivisionPaginationDto>(this.apiUrl, { params });
  }

  getSubdivisions(id: number): Observable<DivisionItemDto[]> {
    return this.http.get<DivisionItemDto[]>(`${this.apiUrl}/${id}/subdivisions`);
  }

  getAllDivisionOptions(): Observable<DivisionBasicDto[]> {
    return this.http.get<DivisionBasicDto[]>(`${this.apiUrl}/options/all`);
  }

  getAllSuperiorDivisionOptions(): Observable<DivisionBasicDto[]> {
    return this.http.get<DivisionBasicDto[]>(`${this.apiUrl}/options/superiors`);
  }

  getAllLevelsOptions(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/options/levels`);
  }
}
