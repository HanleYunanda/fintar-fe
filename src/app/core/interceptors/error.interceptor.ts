import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GlobalErrorService } from '../services/global-error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const errorService = inject(GlobalErrorService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle 401, 403, and all 5xx errors
            if ([401, 403].includes(error.status) || error.status >= 500) {
                errorService.showError(error.status, error.message);
            }
            return throwError(() => error);
        })
    );
};
