import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { Product, CreateProductRequest } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/product`;

    getAll(): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(this.API_URL);
    }

    create(request: CreateProductRequest): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(this.API_URL, request);
    }
}
