import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';

// Models & Services
import { UserService } from '../../core/services/user.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../core/models/user.model';
import { RoleService } from '../../core/services/role.service';
import { RoleResponse } from '../../core/models/role.model';

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        ConfirmDialogModule,
        ToastModule,
        DialogModule,
        ChipModule,
        MultiSelectModule,
        CheckboxModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './user.html',
    styleUrl: './user.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {
    private router = inject(Router);
    private userService = inject(UserService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private roleService = inject(RoleService);

    users = signal<User[]>([]);
    loading = signal<boolean>(false);
    searchValue = signal<string>('');
    rolesPermissionsDialogVisible = signal<boolean>(false);
    selectedUser = signal<User | null>(null);

    // Create/Edit Dialog
    userDialogVisible = signal<boolean>(false);
    dialogMode = signal<'create' | 'edit'>('create');
    availableRoles = signal<RoleResponse[]>([]);
    userForm = signal<{
        username: string;
        email: string;
        password: string;
        roles: RoleResponse[];
    }>({
        username: '',
        email: '',
        password: '',
        roles: []
    });

    ngOnInit(): void {
        this.loadUsers();
        this.loadAvailableRoles();
    }

    loadUsers(): void {
        this.loading.set(true);
        this.userService.getAll().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.users.set(response.data);
                    console.log(this.users());
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading users:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users'
                });
                this.loading.set(false);
            }
        });
    }

    onCreateUser(): void {
        this.openCreateDialog();
    }

    loadAvailableRoles(): void {
        // For now, we'll use a static list. In production, fetch from RoleService
        this.roleService.getAll().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.availableRoles.set(response.data);
                }
            },
            error: (err) => {
                console.error('Error loading roles:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load roles'
                });
            }
        });
    }

    openCreateDialog(): void {
        this.dialogMode.set('create');
        this.userForm.set({
            username: '',
            email: '',
            password: '',
            roles: []
        });
        this.selectedUser.set(null);
        this.userDialogVisible.set(true);
    }

    openEditDialog(user: User): void {
        this.dialogMode.set('edit');
        console.log(user);
        this.userForm.set({
            username: user.username,
            email: user.email,
            password: '', // Don't pre-fill password for security
            roles: user.roles  // Extract role names from RoleResponse objects
        });
        this.selectedUser.set(user);
        this.userDialogVisible.set(true);
    }

    closeUserDialog(): void {
        this.userDialogVisible.set(false);
        this.userForm.set({
            username: '',
            email: '',
            password: '',
            roles: []
        });
        this.selectedUser.set(null);
    }

    saveUser(): void {
        const form = this.userForm();

        // Validation
        if (!form.username || !form.email || !form.roles.length) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Username, email, and at least one role are required'
            });
            return;
        }

        if (this.dialogMode() === 'create' && !form.password) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Password is required for new users'
            });
            return;
        }

        // Validate password strength if provided
        if (form.password) {
            const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
            if (!passwordPattern.test(form.password)) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Validation Error',
                    detail: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit'
                });
                return;
            }
        }

        this.loading.set(true);

        if (this.dialogMode() === 'create') {
            const createRequest: CreateUserRequest = {
                username: form.username,
                email: form.email,
                password: form.password,
                roles: form.roles.map(role => role.name)
            };

            this.userService.create(createRequest).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User created successfully'
                    });
                    this.closeUserDialog();
                    this.loadUsers();
                },
                error: (err) => {
                    console.error('Error creating user:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.error?.message || 'Failed to create user'
                    });
                    this.loading.set(false);
                }
            });
        } else {
            const userId = this.selectedUser()?.id;
            if (!userId) return;

            const updateRequest: UpdateUserRequest = {
                username: form.username,
                email: form.email,
                roles: form.roles.map(role => role.name)
            };

            // Only include password if it was changed
            if (form.password) {
                updateRequest.password = form.password;
            }

            this.userService.update(userId, updateRequest).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User updated successfully'
                    });
                    this.closeUserDialog();
                    this.loadUsers();
                },
                error: (err) => {
                    console.error('Error updating user:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.error?.message || 'Failed to update user'
                    });
                    this.loading.set(false);
                }
            });
        }
    }

    updateFormField(field: 'username' | 'email' | 'password' | 'roles', value: any): void {
        this.userForm.update(form => ({ ...form, [field]: value }));
    }

    onViewUser(user: User): void {
        console.log('View user:', user);
        this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: `Viewing user: ${user.username}`
        });
    }

    onEditUser(user: User): void {
        this.openEditDialog(user);
    }

    onDeleteUser(user: User): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete user "${user.username}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: { class: 'p-button-danger' },
            accept: () => {
                this.loading.set(true);
                this.userService.delete(user.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'User deleted successfully'
                        });
                        this.loadUsers();
                    },
                    error: (err) => {
                        console.error('Error deleting user:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete user'
                        });
                        this.loading.set(false);
                    }
                });
            }
        });
    }

    getSeverity(isActive: boolean): 'success' | 'danger' {
        return isActive ? 'success' : 'danger';
    }

    showRolesPermissions(user: User): void {
        this.selectedUser.set(user);
        this.rolesPermissionsDialogVisible.set(true);
    }

    closeRolesPermissionsDialog(): void {
        this.rolesPermissionsDialogVisible.set(false);
        this.selectedUser.set(null);
    }

    // Get all permissions from all roles
    getUserPermissions(user: User): string[] {
        const permissions: string[] = [];
        user.roles.forEach(role => {
            role.permissions.forEach(permission => {
                if (!permissions.includes(permission.code)) {
                    permissions.push(permission.code);
                }
            });
        });
        return permissions;
    }

    toggleRole(role: RoleResponse): void {
        const currentRoles = this.userForm().roles;
        const index = currentRoles.findIndex(r => r.id === role.id);

        if (index > -1) {
            // Remove role
            const newRoles = currentRoles.filter(r => r.id !== role.id);
            this.updateFormField('roles', newRoles);
        } else {
            // Add role
            this.updateFormField('roles', [...currentRoles, role]);
        }
    }

    isRoleSelected(role: RoleResponse): boolean {
        return this.userForm().roles.some(r => r.id === role.id);
    }
}
