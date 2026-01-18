import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class GlobalErrorService {
    private confirmationService = inject(ConfirmationService);
    private router = inject(Router);

    showError(status: number, message: string) {
        let title = 'Error';
        let detail = message;

        if (status === 401) {
            title = 'Session Expired';
            detail = 'Your session has expired. Please login again.';
        } else if (status === 403) {
            title = 'Access Denied';
            detail = 'You do not have permission to perform this action.';
        } else if (status >= 500) {
            title = 'Server Error';
            detail = 'An unexpected server error occurred. Please try again later.';
        }

        this.confirmationService.confirm({
            header: title,
            message: detail,
            icon: 'pi pi-exclamation-triangle',
            rejectVisible: false,
            acceptLabel: 'OK',
            accept: () => {
                if (status === 401) {
                    this.router.navigate(['/login']);
                }
            }
        });
    }
}
