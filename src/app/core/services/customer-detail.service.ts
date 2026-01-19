import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { CustomerDetail } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerDetailService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/customer-detail`;

    getAll(): Observable<ApiResponse<CustomerDetail[]>> {
        return this.http.get<ApiResponse<CustomerDetail[]>>(this.API_URL);
    }

    getById(id: string): Observable<ApiResponse<CustomerDetail>> {
        return this.http.get<ApiResponse<CustomerDetail>>(`${this.API_URL}/${id}`);
    }
}
