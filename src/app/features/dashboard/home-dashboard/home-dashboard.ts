import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-home-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home-dashboard.html'
})
export class HomeDashboardComponent {
    private authService = inject(AuthService);
    user = signal(this.authService.getUser());
}
