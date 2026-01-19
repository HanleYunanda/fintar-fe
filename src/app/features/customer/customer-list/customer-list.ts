import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Models & Services
import { CustomerDetailService } from '../../../core/services/customer-detail.service';
import { CustomerDetail } from '../../../core/models/customer.model';

@Component({
    selector: 'app-customer-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        TooltipModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './customer-list.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListComponent implements OnInit {
    private router = inject(Router);
    private customerService = inject(CustomerDetailService);
    private messageService = inject(MessageService);

    customers = signal<CustomerDetail[]>([]);
    loading = signal<boolean>(false);

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.loading.set(true);
        this.customerService.getAll().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.customers.set(response.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading customers:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load customers'
                });
                this.loading.set(false);
            }
        });
    }

    viewDetail(id: string): void {
        this.router.navigate(['/customer', id]);
    }
}
