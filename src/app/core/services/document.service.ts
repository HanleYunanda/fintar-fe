import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {

  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

}
