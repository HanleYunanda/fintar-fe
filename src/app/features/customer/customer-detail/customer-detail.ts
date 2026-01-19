import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Core
import { CustomerDetailService } from '../../../core/services/customer-detail.service';
import { CustomerDetail } from '../../../core/models/customer.model';
import { LoanApplication, LoanStatus, LoanDocument } from '../../../core/models/loan.model';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-customer-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TagModule,
        TabsModule,
        ButtonModule,
        TableModule,
        SkeletonModule,
        DividerModule,
        ImageModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './customer-detail.html',
    styleUrl: './customer-detail.css'
})
export class CustomerDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private customerService = inject(CustomerDetailService);
    private messageService = inject(MessageService);

    customerId = signal<string>('');
    customer = signal<CustomerDetail | null>(null);
    documents = signal<LoanDocument[]>([]);
    loans = signal<LoanApplication[]>([]);
    loading = signal<boolean>(true);

    baseUri = environment.apiUrl + "/document";

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.customerId.set(id);
                this.loadData(id);
            }
        });
    }

    loadData(id: string): void {
        this.loading.set(true);
        this.customerService.getById(id).subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    console.log('Customer response:', res.data);
                    this.customer.set(res.data);
                    this.documents.set(res.data.documentResponses || []);
                    this.loans.set(res.data.loans || []);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading customer detail', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load customer details'
                });
                this.loading.set(false);
            }
        });
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

    goBack(): void {
        this.router.navigate(['/customer']);
    }

    viewLoan(loanId: string): void {
        this.router.navigate(['/loan', loanId]);
    }
}
