import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import {
  Plafond,
  CreatePlafondRequest,
  UpdatePlafondRequest,
  PlafondOrderRequest,
} from '../models/plafond.model';

@Injectable({
  providedIn: 'root',
})
export class PlafondService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/plafond`;

  getAll(): Observable<ApiResponse<Plafond[]>> {
    return this.http.get<ApiResponse<Plafond[]>>(this.API_URL);
  }

  getActive(): Observable<ApiResponse<Plafond[]>> {
    return this.http.get<ApiResponse<Plafond[]>>(`${this.API_URL}/active`);
  }

  getById(id: string): Observable<ApiResponse<Plafond>> {
    return this.http.get<ApiResponse<Plafond>>(`${this.API_URL}/${id}`);
  }

  create(request: CreatePlafondRequest): Observable<ApiResponse<Plafond>> {
    return this.http.post<ApiResponse<Plafond>>(this.API_URL, request);
  }

  update(id: string, request: UpdatePlafondRequest): Observable<ApiResponse<Plafond>> {
    return this.http.put<ApiResponse<Plafond>>(`${this.API_URL}/${id}`, request);
  }

  updateOrders(requests: PlafondOrderRequest[]): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.API_URL}/orders`, requests);
  }

  delete(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.API_URL}/${id}`);
  }
}
