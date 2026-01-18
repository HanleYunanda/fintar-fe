import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';

// Core
import { LoanService } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoanApplication, LoanStatus } from '../../../core/models/loan.model';

@Component({
    selector: 'app-loan-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        CardModule,
        TagModule,
        ToastModule,
        DividerModule,
        InputTextModule,
        SelectModule,
        IconFieldModule,
        InputIconModule,
        DatePickerModule
    ],
    providers: [MessageService],
    templateUrl: './loan-list.html',
    styleUrl: './loan-list.css'
})
export class LoanListComponent implements OnInit {
    private loanService = inject(LoanService);
    private authService = inject(AuthService);
    private router = inject(Router);

    allLoans = signal<LoanApplication[]>([]);
    loading = signal<boolean>(false);

    // Filters
    filterLoanId = signal<string>('');
    filterStatus = signal<string | null>(null);
    filterStartDate = signal<Date | null>(null);
    filterEndDate = signal<Date | null>(null);

    statusOptions = [
        { label: 'All Status', value: null },
        { label: 'Created', value: LoanStatus.CREATED },
        { label: 'Reviewed', value: LoanStatus.REVIEWED },
        { label: 'Approved', value: LoanStatus.APPROVED },
        { label: 'Rejected', value: LoanStatus.REJECTED },
        { label: 'Disbursed', value: LoanStatus.DISBURSED },
    ];

    loans = computed(() => {
        let result = this.allLoans();
        const loanId = this.filterLoanId().toLowerCase();
        const status = this.filterStatus();
        const startDate = this.filterStartDate();
        const endDate = this.filterEndDate();

        if (loanId) {
            result = result.filter(l => l.id.toLowerCase().includes(loanId));
        }
        if (status) {
            result = result.filter(l => l.status === status);
        }
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            result = result.filter(l => new Date(l.createdAt) >= start);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(l => new Date(l.createdAt) <= end);
        }

        return result;
    });

    ngOnInit(): void {
        this.loadLoans();
    }

    loadLoans(): void {
        this.loading.set(true);
        this.loanService.getAll().subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    this.allLoans.set(res.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    clearFilters(): void {
        this.filterLoanId.set('');
        this.filterStatus.set(null);
        this.filterStartDate.set(null);
        this.filterEndDate.set(null);
    }

    getSeverity(status: LoanStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
        switch (status) {
            case LoanStatus.APPROVED: return 'success';
            case LoanStatus.REVIEWED: return 'info';
            case LoanStatus.CREATED: return 'warn';
            case LoanStatus.REJECTED: return 'danger';
            case LoanStatus.DISBURSED: return 'success';
            default: return 'secondary';
        }
    }

    viewDetail(loan: LoanApplication): void {
        this.router.navigate(['/loan', loan.id]);
    }
}
