import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

// Models & Services
import { ProductService } from '../../core/services/product.service';
import { PlafondService } from '../../core/services/plafond.service';
import { Product, CreateProductRequest } from '../../core/models/product.model';
import { Plafond } from '../../core/models/plafond.model';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        ToastModule,
        DialogModule
    ],
    providers: [MessageService],
    templateUrl: './product.html',
    styleUrl: './product.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {
    private productService = inject(ProductService);
    private plafondService = inject(PlafondService);
    private messageService = inject(MessageService);

    products = signal<Product[]>([]);
    availablePlafonds = signal<Plafond[]>([]);
    loading = signal<boolean>(false);
    searchValue = signal<string>('');

    // Create Dialog
    dialogVisible = signal<boolean>(false);
    productForm = signal<CreateProductRequest>({
        plafondId: '',
        tenor: 1,
        interestRate: 0
    });

    ngOnInit(): void {
        this.loadProducts();
        this.loadPlafonds();
    }

    loadProducts(): void {
        this.loading.set(true);
        this.productService.getAll().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.products.set(response.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading products:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load products'
                });
                this.loading.set(false);
            }
        });
    }

    loadPlafonds(): void {
        this.plafondService.getAll().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.availablePlafonds.set(response.data);
                }
            }
        });
    }

    openCreateDialog(): void {
        this.productForm.set({
            plafondId: '',
            tenor: 1,
            interestRate: 0
        });
        this.dialogVisible.set(true);
    }

    closeDialog(): void {
        this.dialogVisible.set(false);
    }

    saveProduct(): void {
        const form = this.productForm();

        // Validation based on Swagger (tenor 1-48, interest 0-100)
        if (!form.plafondId) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please select a plafond' });
            return;
        }
        if (form.tenor < 1 || form.tenor > 48) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Tenor must be between 1 and 48 months' });
            return;
        }
        if (form.interestRate < 0 || form.interestRate > 100) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Interest rate must be between 0 and 100' });
            return;
        }

        this.loading.set(true);
        this.productService.create(form).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product created successfully'
                });
                this.closeDialog();
                this.loadProducts();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Failed to create product'
                });
                this.loading.set(false);
            }
        });
    }

    updateFormField(field: keyof CreateProductRequest, value: any): void {
        this.productForm.update(form => ({ ...form, [field]: value }));
    }
}
