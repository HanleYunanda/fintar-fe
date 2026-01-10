import { Component, ChangeDetectionStrategy, signal, inject, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ToolbarModule,
        ButtonModule,
        DrawerModule,
        AvatarModule,
        MenuModule,
        TieredMenuModule,
        BadgeModule,
        DividerModule,
        RippleModule
    ],
    templateUrl: './dashboard-layout.html',
    styleUrl: './dashboard-layout.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayout {
    private authService = inject(AuthService);

    isSidebarVisible = signal<boolean>(window.innerWidth >= 768);

    @HostListener('window:resize')
    onResize() {
        const shouldShow = window.innerWidth >= 768;
        this.isSidebarVisible.set(shouldShow);
    }

    // User Info Mock
    user = this.authService.getUser() || { id: '', username: 'User', email: '', roles: ['Staff'], permissions: [], token: '' };

    items: MenuItem[] = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/dashboard' }
            ]
        },
        {
            label: 'Master',
            items: [
                { label: 'User', icon: 'pi pi-fw pi-user', routerLink: '/user' },
                { label: 'Role', icon: 'pi pi-fw pi-users', routerLink: '/role' },
                { label: 'Permission', icon: 'pi pi-fw pi-key', routerLink: '/permission' },
                { label: 'Plafond', icon: 'pi pi-fw pi-crown', routerLink: '/plafond' },
                { label: 'Product', icon: 'pi pi-fw pi-credit-card', routerLink: '/product' }
            ]
        },
        {
            label: 'Loan Management',
            items: [
                { label: 'Loan Plafond', icon: 'pi pi-fw pi-dollar', routerLink: '/dashboard/loan-plafond' },
                { label: 'Applications', icon: 'pi pi-fw pi-file', routerLink: '/dashboard/applications' },
                { label: 'Documents', icon: 'pi pi-fw pi-folder', routerLink: '/dashboard/documents' }
            ]
        },
    ];

    userMenuItems: MenuItem[] = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
                // Navigate to profile - for now just log
                console.log('Navigate to profile');
            }
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
        }
    ];

    toggleSidebar() {
        this.isSidebarVisible.update(v => !v);
    }

    logout() {
        this.authService.logout();
        window.location.reload();
    }
}
