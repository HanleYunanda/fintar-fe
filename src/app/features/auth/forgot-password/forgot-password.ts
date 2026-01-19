import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ImageModule } from 'primeng/image';

// Models & Services
import { AuthService } from '../../../core/services/auth.service';
import { ApiResponse } from '../../../core/models/api.model';

interface ForgotPasswordForm {
    email: FormControl<string>;
}

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        CardModule,
        InputTextModule,
        ButtonModule,
        FloatLabelModule,
        MessageModule,
        ImageModule
    ],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    forgotPasswordForm: FormGroup<ForgotPasswordForm> = this.fb.group<ForgotPasswordForm>({
        email: this.fb.nonNullable.control('', [Validators.required, Validators.email])
    });

    onSubmit(): void {
        if (this.forgotPasswordForm.invalid) {
            this.forgotPasswordForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        const email = this.forgotPasswordForm.controls.email.value;

        this.authService.forgotPassword(email).subscribe({
            next: (response: ApiResponse<any>) => {
                this.isLoading.set(false);
                this.successMessage.set('Password reset link has been sent to your email.');
                // Optionally redirect after some time
                // setTimeout(() => this.router.navigate(['/login']), 5000);
            },
            error: (err: any) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Failed to send reset link. Please try again.');
            }
        });
    }
}
