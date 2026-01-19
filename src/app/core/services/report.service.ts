import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoanStatus } from '../models/loan.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api.model';

export interface LoanStatusStat {
    status: LoanStatus;
    count: number;
}

export interface DisbursementStat {
    year: string;
    month: string;
    amount: number;
}

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/loan/report`;

    getLoanStatusStats(): Observable<ApiResponse<LoanStatusStat[]>> {
        return this.http.get<ApiResponse<LoanStatusStat[]>>(this.API_URL + '/applications-by-status');
    }

    getDisbursementStats(): Observable<ApiResponse<DisbursementStat[]>> {
        return this.http.get<ApiResponse<DisbursementStat[]>>(this.API_URL + '/disbursement-trends');
    }

    getBestSellingProducts(): Observable<ApiResponse<ProductStat[]>> {
        return this.http.get<ApiResponse<ProductStat[]>>(this.API_URL + '/best-selling-products');
    }

    getMonthKPIs(): Observable<ApiResponse<MonthKPI>> {
        return this.http.get<ApiResponse<MonthKPI>>(this.API_URL + '/dashboard-summary');
    }
}

export interface ProductStat {
    productName: string;
    count: number;
}

export interface MonthKPI {
    totalApplications: number;
    totalOutstanding: number;
    activeLoans: number;
    approvalRate: number;
}
