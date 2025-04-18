import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DivisionItemDto } from './dtos/division-item.dto';
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
}
