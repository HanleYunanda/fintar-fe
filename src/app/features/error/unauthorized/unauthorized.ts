import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './unauthorized.html',
    styleUrl: './unauthorized.css'
})
export class UnauthorizedComponent {
    constructor(private router: Router) { }

    goDashboard(): void {
        this.router.navigate(['/dashboard']);
    }
}
