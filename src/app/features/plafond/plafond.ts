import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';

// Models & Services
import { PlafondService } from '../../core/services/plafond.service';
import { Plafond, CreatePlafondRequest, UpdatePlafondRequest } from '../../core/models/plafond.model';

@Component({
  selector: 'app-plafond',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './plafond.html',
  styleUrl: './plafond.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlafondComponent implements OnInit {
  private plafondService = inject(PlafondService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  plafonds = signal<Plafond[]>([]);
  loading = signal<boolean>(false);
  searchValue = signal<string>('');

  // Create/Edit Dialog
  dialogVisible = signal<boolean>(false);
  dialogMode = signal<'create' | 'edit'>('create');
  selectedPlafond = signal<Plafond | null>(null);
  plafondForm = signal<CreatePlafondRequest>({
    name: '',
    maxAmount: 0,
    maxTenor: 0
  });

  ngOnInit(): void {
    this.loadPlafonds();
  }

  loadPlafonds(): void {
    this.loading.set(true);
    this.plafondService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.plafonds.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading plafonds:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load plafonds'
        });
        this.loading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    this.dialogMode.set('create');
    this.plafondForm.set({
      name: '',
      maxAmount: 0,
      maxTenor: 0
    });
    this.selectedPlafond.set(null);
    this.dialogVisible.set(true);
  }

  openEditDialog(plafond: Plafond): void {
    this.dialogMode.set('edit');
    this.plafondForm.set({
      name: plafond.name,
      maxAmount: plafond.maxAmount,
      maxTenor: plafond.maxTenor
    });
    this.selectedPlafond.set(plafond);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.plafondForm.set({
      name: '',
      maxAmount: 0,
      maxTenor: 0
    });
    this.selectedPlafond.set(null);
  }

  savePlafond(): void {
    const form = this.plafondForm();

    // Validation
    if (!form.name || form.maxAmount <= 0 || form.maxTenor <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'All fields are required and must be positive values'
      });
      return;
    }

    this.loading.set(true);

    if (this.dialogMode() === 'create') {
      this.plafondService.create(form).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Plafond created successfully'
          });
          this.closeDialog();
          this.loadPlafonds();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to create plafond'
          });
          this.loading.set(false);
        }
      });
    } else {
      const id = this.selectedPlafond()?.id;
      if (!id) return;

      this.plafondService.update(id, form).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Plafond updated successfully'
          });
          this.closeDialog();
          this.loadPlafonds();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update plafond'
          });
          this.loading.set(false);
        }
      });
    }
  }

  deletePlafond(plafond: Plafond): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete plafond "${plafond.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { severity: 'danger' },
      accept: () => {
        this.loading.set(true);
        this.plafondService.delete(plafond.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Plafond deleted successfully'
            });
            this.loadPlafonds();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete plafond'
            });
            this.loading.set(false);
          }
        });
      }
    });
  }

  updateFormField(field: keyof CreatePlafondRequest, value: any): void {
    this.plafondForm.update(form => ({ ...form, [field]: value }));
  }
}
