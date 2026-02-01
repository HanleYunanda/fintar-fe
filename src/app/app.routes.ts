import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { DashboardLayout } from './shared/layouts/dashboard-layout/dashboard-layout';
import { LandingPage } from './features/landing-page/landing-page';
import { UserComponent } from './features/user/user';
import { RoleComponent } from './features/role/role';
import { PermissionComponent } from './features/permission/permission';
import { PageNotFound } from './features/error/page-not-found/page-not-found';
import { PlafondComponent } from './features/plafond/plafond';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'auth/forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./features/error/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
    },
    {
        path: '',
        component: DashboardLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/home-dashboard/home-dashboard').then(m => m.HomeDashboardComponent)
            },
            {
                path: 'user',
                component: UserComponent,
                canActivate: [permissionGuard],
                data: { permission: 'READ_USER' }
            },
            {
                path: 'role',
                loadComponent: () => import('./features/role/role').then(m => m.RoleComponent),
                canActivate: [permissionGuard],
                data: { permission: 'READ_ROLE' }
            },
            {
                path: 'permission',
                loadComponent: () => import('./features/permission/permission').then(m => m.PermissionComponent),
                canActivate: [permissionGuard],
                data: { permission: 'READ_PERMISSION' }
            },
            {
                path: 'plafond',
                loadComponent: () => import('./features/plafond/plafond').then(m => m.PlafondComponent)
            },
            {
                path: 'product',
                loadComponent: () => import('./features/product/product').then(m => m.ProductComponent)
            },
            {
                path: 'customer',
                loadComponent: () => import('./features/customer/customer-list/customer-list').then(m => m.CustomerListComponent),
                canActivate: [permissionGuard],
                data: { permission: 'READ_CUSTOMER_DETAIL' }
            },
            {
                path: 'customer/:id',
                loadComponent: () => import('./features/customer/customer-detail/customer-detail').then(m => m.CustomerDetailComponent),
                canActivate: [permissionGuard],
                data: { permission: 'READ_CUSTOMER_DETAIL' }
            },
            {
                path: 'loan',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/loan/loan-list/loan-list').then(m => m.LoanListComponent)
                    },
                    {
                        path: 'report',
                        loadComponent: () => import('./features/report/report-dashboard/report-dashboard').then(m => m.ReportDashboardComponent),
                        canActivate: [permissionGuard],
                        data: { permission: 'READ_REPORT' }
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./features/loan/loan-detail/loan-detail').then(m => m.LoanDetailComponent)
                    },
                ]
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/user/profile/profile').then(m => m.ProfileComponent)
            },
            {
                path: 'change-password',
                loadComponent: () => import('./features/user/change-password/change-password').then(m => m.ChangePasswordComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        component: PageNotFound
    }
];
