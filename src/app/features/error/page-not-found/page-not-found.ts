import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [RouterLink, ButtonModule],
    templateUrl: './page-not-found.html'
})
export class PageNotFound {

}
