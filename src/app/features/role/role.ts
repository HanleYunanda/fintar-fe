import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';

// Models & Services
import { RoleService } from '../../core/services/role.service';
import { PermissionService } from '../../core/services/permission.service';
import { RoleResponse, RoleRequest } from '../../core/models/role.model';
import { Permission } from '../../core/models/permission.model';

@Component({
    selector: 'app-role',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ConfirmDialogModule,
        ToastModule,
        MultiSelectModule,
        CheckboxModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './role.html',
    styleUrl: './role.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent implements OnInit {
    private roleService = inject(RoleService);
    private permissionService = inject(PermissionService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    roles = signal<RoleResponse[]>([]);
    permissions = signal<Permission[]>([]);
    loading = signal<boolean>(false);
    dialogVisible = signal<boolean>(false);
    permissionDialogVisible = signal<boolean>(false);
    dialogMode = signal<'create' | 'edit'>('create');
    selectedRole = signal<RoleResponse | null>(null);
    selectedPermissions = signal<string[]>([]);

    roleForm = signal<RoleRequest>({ name: '' });

    ngOnInit(): void {
        this.loadRoles();
        this.loadPermissions();
    }

    loadRoles(): void {
        this.loading.set(true);
        this.roleService.getAll().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.roles.set(response.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading roles:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load roles'
                });
                this.loading.set(false);
            }
        });
    }

    loadPermissions(): void {
        this.permissionService.getAll().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.permissions.set(response.data);
                }
            },
            error: (err) => {
                console.error('Error loading permissions:', err);
            }
        });
    }

    openCreateDialog(): void {
        this.dialogMode.set('create');
        this.roleForm.set({ name: '' });
        this.selectedRole.set(null);
        this.dialogVisible.set(true);
    }

    openEditDialog(role: RoleResponse): void {
        this.dialogMode.set('edit');
        this.roleForm.set({ name: role.name });
        this.selectedRole.set(role);
        this.dialogVisible.set(true);
    }

    openPermissionDialog(role: RoleResponse): void {
        this.selectedRole.set(role);
        this.selectedPermissions.set([]);
        this.permissionDialogVisible.set(true);

        // Fetch current permissions for this role
        this.loading.set(true);
        this.roleService.getById(role.id).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.selectedPermissions.set(response.data.permissions.map(p => p.code));
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading role details:', err);
                this.loading.set(false);
            }
        });
    }

    closeDialog(): void {
        this.dialogVisible.set(false);
        this.roleForm.set({ name: '' });
        this.selectedRole.set(null);
    }

    closePermissionDialog(): void {
        this.permissionDialogVisible.set(false);
        this.selectedPermissions.set([]);
        this.selectedRole.set(null);
    }

    saveRole(): void {
        const request = this.roleForm();

        if (!request.name || request.name.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Role name is required'
            });
            return;
        }

        this.loading.set(true);

        if (this.dialogMode() === 'create') {
            this.roleService.create(request).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Role created successfully'
                    });
                    this.closeDialog();
                    this.loadRoles();
                },
                error: (err) => {
                    console.error('Error creating role:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create role'
                    });
                    this.loading.set(false);
                }
            });
        } else {
            const roleId = this.selectedRole()?.id;
            if (roleId) {
                this.roleService.update(roleId, request).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Role updated successfully'
                        });
                        this.closeDialog();
                        this.loadRoles();
                    },
                    error: (err) => {
                        console.error('Error updating role:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update role'
                        });
                        this.loading.set(false);
                    }
                });
            }
        }
    }

    assignPermissions(): void {
        const roleId = this.selectedRole()?.id;
        const permissionCodes = this.selectedPermissions();

        if (!roleId) {
            return;
        }

        this.loading.set(true);
        this.roleService.assignPermissions(roleId, { permissionCodes }).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Permissions assigned successfully'
                });
                this.closePermissionDialog();
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error assigning permissions:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to assign permissions'
                });
                this.loading.set(false);
            }
        });
    }

    deleteRole(role: RoleResponse): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete role "${role.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: { class: 'p-button-danger' },
            accept: () => {
                this.loading.set(true);
                this.roleService.delete(role.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Role deleted successfully'
                        });
                        this.loadRoles();
                    },
                    error: (err) => {
                        console.error('Error deleting role:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete role'
                        });
                        this.loading.set(false);
                    }
                });
            }
        });
    }

    updateFormField(field: keyof RoleRequest, value: string): void {
        this.roleForm.update(form => ({ ...form, [field]: value }));
    }

    togglePermission(permissionCode: string): void {
        const currentPermissions = this.selectedPermissions();
        const index = currentPermissions.indexOf(permissionCode);

        if (index > -1) {
            // Remove permission
            this.selectedPermissions.set(currentPermissions.filter(p => p !== permissionCode));
        } else {
            // Add permission
            this.selectedPermissions.set([...currentPermissions, permissionCode]);
        }
    }

    isPermissionSelected(permissionCode: string): boolean {
        return this.selectedPermissions().includes(permissionCode);
    }
}
