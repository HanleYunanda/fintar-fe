import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Models & Services
import { PermissionService } from '../../core/services/permission.service';
import { Permission, PermissionRequest } from '../../core/models/permission.model';

@Component({
    selector: 'app-permission',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './permission.html',
    styleUrl: './permission.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionComponent implements OnInit {
    private permissionService = inject(PermissionService);
    private messageService = inject(MessageService);

    permissions = signal<Permission[]>([]);
    loading = signal<boolean>(false);
    dialogVisible = signal<boolean>(false);

    permissionForm = signal<PermissionRequest>({ code: '' });

    ngOnInit(): void {
        this.loadPermissions();
    }

    loadPermissions(): void {
        this.loading.set(true);
        this.permissionService.getAll().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.permissions.set(response.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading permissions:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load permissions'
                });
                this.loading.set(false);
            }
        });
    }

    openCreateDialog(): void {
        this.permissionForm.set({ code: '' });
        this.dialogVisible.set(true);
    }

    closeDialog(): void {
        this.dialogVisible.set(false);
        this.permissionForm.set({ code: '' });
    }

    savePermission(): void {
        const request = this.permissionForm();

        if (!request.code || request.code.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Permission code is required'
            });
            return;
        }

        this.loading.set(true);
        this.permissionService.create(request).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Permission created successfully'
                });
                this.closeDialog();
                this.loadPermissions();
            },
            error: (err) => {
                console.error('Error creating permission:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Failed to create permission'
                });
                this.loading.set(false);
            }
        });
    }

    updateFormField(field: keyof PermissionRequest, value: string): void {
        this.permissionForm.update(form => ({ ...form, [field]: value }));
    }
}
