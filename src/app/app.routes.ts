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
                component: UserComponent
            },
            {
                path: 'role',
                loadComponent: () => import('./features/role/role').then(m => m.RoleComponent)
            },
            {
                path: 'permission',
                loadComponent: () => import('./features/permission/permission').then(m => m.PermissionComponent)
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
                path: 'loan',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/loan/loan-list/loan-list').then(m => m.LoanListComponent)
                    },
                    {
                        path: 'report',
                        loadComponent: () => import('./features/report/report-dashboard/report-dashboard').then(m => m.ReportDashboardComponent)
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
