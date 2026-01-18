import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/user`;

    getAll(): Observable<ApiResponse<User[]>> {
        return this.http.get<ApiResponse<User[]>>(this.API_URL);
    }

    getById(id: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.API_URL}/${id}`);
    }

    create(request: CreateUserRequest): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(this.API_URL, request);
    }

    update(id: string, request: UpdateUserRequest): Observable<ApiResponse<User>> {
        return this.http.put<ApiResponse<User>>(`${this.API_URL}/${id}`, request);
    }

    changePassword(id: string, request: ChangePasswordRequest): Observable<ApiResponse<User>> {
        return this.http.patch<ApiResponse<User>>(`${this.API_URL}/${id}/changePassword`, request);
    }

    delete(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
    }
}
