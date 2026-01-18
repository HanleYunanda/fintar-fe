import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { LoanApplication, LoanActionRequest, CreateLoanRequest, LoanStatus, LoanDetailResponse } from '../models/loan.model';

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/loan`;

    getAll(status?: LoanStatus): Observable<ApiResponse<LoanApplication[]>> {
        let params = new HttpParams();
        if (status) {
            params = params.set('status', status);
        }
        return this.http.get<ApiResponse<LoanApplication[]>>(this.API_URL, { params });
    }

    getById(id: string): Observable<ApiResponse<LoanDetailResponse>> {
        return this.http.get<ApiResponse<LoanDetailResponse>>(`${this.API_URL}/${id}`);
    }

    create(request: CreateLoanRequest): Observable<ApiResponse<LoanApplication>> {
        return this.http.post<ApiResponse<LoanApplication>>(this.API_URL, request);
    }

    // Marketing Review
    review(id: string, note: string): Observable<ApiResponse<LoanApplication>> {
        const body: LoanActionRequest = { action: LoanStatus.REVIEWED, note };
        return this.http.post<ApiResponse<LoanApplication>>(`${this.API_URL}/${id}/review`, body);
    }

    // Branch Manager Approval
    approve(id: string, note: string): Observable<ApiResponse<LoanApplication>> {
        const body: LoanActionRequest = { action: LoanStatus.APPROVED, note };
        return this.http.post<ApiResponse<LoanApplication>>(`${this.API_URL}/${id}/approval`, body);
    }

    reject(id: string, note: string): Observable<ApiResponse<LoanApplication>> {
        const body: LoanActionRequest = { action: LoanStatus.REJECTED, note };
        return this.http.post<ApiResponse<LoanApplication>>(`${this.API_URL}/${id}/approval`, body);
    }

    // Finance Disburse
    disburse(id: string, note: string): Observable<ApiResponse<LoanApplication>> {
        const body: LoanActionRequest = { action: LoanStatus.DISBURSED, note }; // Use typo matched enum
        return this.http.post<ApiResponse<LoanApplication>>(`${this.API_URL}/${id}/disburse`, body);
    }
}
