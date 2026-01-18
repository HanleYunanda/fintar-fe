import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiResponse } from '../../../core/models/api.model';
import { User } from '../../../core/models/user.model';
import { MessageService } from 'primeng/api';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        ToastModule,
        MessageModule
    ],
    providers: [MessageService],
    templateUrl: './change-password.html'
})
export class ChangePasswordComponent {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private router = inject(Router);

    loading = signal(false);

    form = this.fb.group({
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get('newPassword')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        if (newPassword !== confirmPassword) {
            control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        } else {
            return null;
        }
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const user = this.authService.getUser();
        if (!user) return;

        this.loading.set(true);
        const { oldPassword, newPassword } = this.form.value;

        this.userService.changePassword(user.id, {
            oldPassword: oldPassword as string,
            newPassword: newPassword as string
        }).subscribe({
            next: (response: ApiResponse<User>) => {
                this.loading.set(false);
                if (response.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Password changed successfully'
                    });
                    this.form.reset();
                    setTimeout(() => this.router.navigate(['/profile']), 2000);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.message || 'Failed to change password'
                    });
                }
            },
            error: (err: any) => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Failed to change password'
                });
            }
        });
    }
}
