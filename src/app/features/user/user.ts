import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
        ReactiveFormsModule,
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
    private fb = inject(FormBuilder);

    users = signal<User[]>([]);
    loading = signal<boolean>(false);
    searchValue = signal<string>('');
    rolesPermissionsDialogVisible = signal<boolean>(false);
    selectedUser = signal<User | null>(null);

    // Create/Edit Dialog
    userDialogVisible = signal<boolean>(false);
    dialogMode = signal<'create' | 'edit'>('create');
    availableRoles = signal<RoleResponse[]>([]);

    // Reactive Form
    userForm!: FormGroup;

    ngOnInit(): void {
        this.initForm();
        this.loadUsers();
        this.loadAvailableRoles();
    }

    initForm() {
        this.userForm = this.fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)]],
            roles: [[], [Validators.required]]
        });
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
        this.userForm.reset({ roles: [] });

        // Add password validators for create mode
        const passwordControl = this.userForm.get('password');
        passwordControl?.setValidators([Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)]);
        passwordControl?.updateValueAndValidity();

        this.selectedUser.set(null);
        this.userDialogVisible.set(true);
    }

    openEditDialog(user: User): void {
        this.dialogMode.set('edit');
        console.log(user);

        // Clear password validators for edit mode (optional)
        const passwordControl = this.userForm.get('password');
        passwordControl?.clearValidators();
        passwordControl?.setValidators([Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)]); // Still keep strength check if entered
        passwordControl?.updateValueAndValidity();

        this.userForm.patchValue({
            username: user.username,
            email: user.email,
            password: '',
            roles: user.roles
        });

        this.selectedUser.set(user);
        this.userDialogVisible.set(true);
    }

    closeUserDialog(): void {
        this.userDialogVisible.set(false);
        this.InitFormForClose();
        this.selectedUser.set(null);
    }

    InitFormForClose() {
        this.userForm.reset({ roles: [] });
    }

    saveUser(): void {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please fill all required fields correctly'
            });
            return;
        }

        const formValue = this.userForm.value;
        this.loading.set(true);

        if (this.dialogMode() === 'create') {
            const createRequest: CreateUserRequest = {
                username: formValue.username,
                email: formValue.email,
                password: formValue.password,
                roles: formValue.roles.map((r: any) => r.name)
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
                username: formValue.username,
                email: formValue.email,
                roles: formValue.roles.map((r: any) => r.name)
            };

            // Only include password if it was changed
            if (formValue.password) {
                updateRequest.password = formValue.password;
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
        const currentRoles = this.userForm.get('roles')?.value || [];
        const index = currentRoles.findIndex((r: any) => r.id === role.id);

        let newRoles;
        if (index > -1) {
            // Remove role
            newRoles = currentRoles.filter((r: any) => r.id !== role.id);
        } else {
            // Add role
            newRoles = [...currentRoles, role];
        }

        this.userForm.patchValue({ roles: newRoles });
        this.userForm.get('roles')?.markAsDirty();
    }

    isRoleSelected(role: RoleResponse): boolean {
        const currentRoles = this.userForm.get('roles')?.value || [];
        return currentRoles.some((r: any) => r.id === role.id);
    }
}
