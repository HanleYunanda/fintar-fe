import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/models/auth.model';
import { ApiResponse } from '../../../core/models/api.model';

// PrimeNG
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        AvatarModule,
        DividerModule,
        BadgeModule,
        ChipModule
    ],
    templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);

    user = signal<LoginResponse | null>(null);

    ngOnInit() {
        this.fetchProfile();
    }

    fetchProfile() {
        this.authService.getCurrentUser().subscribe({
            next: (response: ApiResponse<LoginResponse>) => {
                if (response.success) {
                    this.user.set(response.data);
                }
            },
            error: (err: any) => {
                console.error('Error fetching profile:', err);
                // Fallback to local storage user if API fails
                this.user.set(this.authService.getUser());
            }
        });
    }
}
