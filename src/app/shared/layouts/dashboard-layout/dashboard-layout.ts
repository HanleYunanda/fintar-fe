import { Component, ChangeDetectionStrategy, signal, inject, HostListener, computed } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
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
    private router = inject(Router);

    isSidebarVisible = signal<boolean>(window.innerWidth >= 768);

    @HostListener('window:resize')
    onResize() {
        const shouldShow = window.innerWidth >= 768;
        this.isSidebarVisible.set(shouldShow);
    }

    user = this.authService.getUser() || { id: '', username: 'User', email: '', roles: [], permissions: [], token: '' };

    // Define all menu items with their required permissions
    private allMenuItems: MenuItem[] = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/dashboard' }
            ]
        },
        {
            label: 'Master',
            items: [
                { label: 'User', icon: 'pi pi-fw pi-user', routerLink: '/user', data: { permission: 'READ_USER' } },
                { label: 'Role', icon: 'pi pi-fw pi-users', routerLink: '/role', data: { permission: 'READ_ROLE' } },
                { label: 'Permission', icon: 'pi pi-fw pi-key', routerLink: '/permission', data: { permission: 'READ_PERMISSION' } },
                { label: 'Plafond', icon: 'pi pi-fw pi-crown', routerLink: '/plafond', data: { permission: 'READ_PLAFOND' } },
                { label: 'Product', icon: 'pi pi-fw pi-credit-card', routerLink: '/product', data: { permission: 'READ_PRODUCT' } },
                { label: 'Customer', icon: 'pi pi-fw pi-users', routerLink: '/customer', data: { permission: 'READ_USER' } }
            ]
        },
        {
            label: 'Loan Management',
            items: [
                { label: 'Loan Application', icon: 'pi pi-fw pi-dollar', routerLink: '/loan', data: { permission: 'READ_LOAN' } },
                { label: 'Report', icon: 'pi pi-fw pi-file', routerLink: '/loan/report', data: { permission: 'READ_REPORT' } },
            ]
        },
    ];

    // Computed signal to filter menu items based on permissions
    items = computed(() => {
        return this.allMenuItems.map(section => ({
            ...section,
            items: section.items?.filter(item => {
                // If no permission required, always show
                if (!item['data']?.['permission']) {
                    console.log("SHOW");
                    return true;
                }
                // Check if user has the required permission
                console.log("HIDE");
                return this.authService.hasPermission(item['data']['permission']);
            })
        })).filter(section => section.items && section.items.length > 0); // Remove empty sections
    });

    userMenuItems: MenuItem[] = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => this.router.navigate(['/profile'])
        },
        {
            label: 'Change Password',
            icon: 'pi pi-key',
            command: () => this.router.navigate(['/change-password'])
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
