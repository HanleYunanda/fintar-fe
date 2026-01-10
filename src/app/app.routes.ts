import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { DashboardLayout } from './shared/layouts/dashboard-layout/dashboard-layout';
import { Home } from './features/home/home';
import { UserComponent } from './features/user/user';
import { RoleComponent } from './features/role/role';
import { PermissionComponent } from './features/permission/permission';
import { PageNotFound } from './features/error/page-not-found/page-not-found';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: DashboardLayout,
        children: [
            {
                path: '',
                component: Home
            },
            {
                path: 'user',
                component: UserComponent
            },
            {
                path: 'role',
                component: RoleComponent
            },
            {
                path: 'permission',
                component: PermissionComponent
            }
        ]
    },
    {
        path: '**',
        component: PageNotFound
    }
];
