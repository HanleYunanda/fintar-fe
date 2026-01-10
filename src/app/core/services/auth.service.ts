import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api.model';
import { LoginRequest, LoginResponse } from '../models/auth.model';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'auth_token';

    login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, request)
            .pipe(
                tap(response => {
                    if (response.success && response.data.token) {
                        this.saveToken(response.data.token);
                        this.saveUser(response.data);
                    }
                })
            );
    }

    saveToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    saveUser(user: LoginResponse): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser(): LoginResponse | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
}
