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

    getLoanStatusStats(): Observable<LoanStatusStat[]> {
        // Dummy data
        const data: LoanStatusStat[] = [
            { status: LoanStatus.CREATED, count: 15 },
            { status: LoanStatus.REVIEWED, count: 8 },
            { status: LoanStatus.APPROVED, count: 12 },
            { status: LoanStatus.REJECTED, count: 5 },
            { status: LoanStatus.DISBURSED, count: 20 }
        ];
        return of(data);
    }

    getDisbursementStats(): Observable<ApiResponse<DisbursementStat[]>> {
        return this.http.get<ApiResponse<DisbursementStat[]>>(this.API_URL + '/disbursement-trends');
    }

    getBestSellingProducts(): Observable<ProductStat[]> {
        const data: ProductStat[] = [
            { product: 'IRON 3', count: 45 },
            { product: 'BRONZE 3', count: 28 },
            { product: 'BRONZE 6', count: 15 },
        ];
        return of(data);
    }

    getMonthKPIs(): Observable<ApiResponse<MonthKPI>> {
        // return of({
        //     totalApplications: 125,
        //     totalOutstanding: 4500000000,
        //     activeLoans: 85,
        //     approvalRate: 75.5 // percent
        // });
        return this.http.get<ApiResponse<MonthKPI>>(this.API_URL + '/dashboard-summary');
    }
}

export interface ProductStat {
    product: string;
    count: number;
}

export interface MonthKPI {
    totalApplications: number;
    totalOutstanding: number;
    activeLoans: number;
    approvalRate: number;
}
