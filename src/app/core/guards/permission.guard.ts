import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const requiredPermission = route.data['permission'] as string;

    // If no permission is required for the route, allow access
    if (!requiredPermission) {
        return true;
    }

    // Check if user has the specific permission
    if (authService.hasPermission(requiredPermission)) {
        return true;
    }

    // If check fails, redirect to unauthorized page
    router.navigate(['/unauthorized']);
    return false;
};
