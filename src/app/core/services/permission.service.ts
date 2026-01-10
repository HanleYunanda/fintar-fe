import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { Permission, PermissionRequest } from '../models/permission.model';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/permission`;

    getAll(): Observable<ApiResponse<Permission[]>> {
        return this.http.get<ApiResponse<Permission[]>>(this.API_URL);
    }

    create(request: PermissionRequest): Observable<ApiResponse<Permission>> {
        return this.http.post<ApiResponse<Permission>>(this.API_URL, request);
    }
}
