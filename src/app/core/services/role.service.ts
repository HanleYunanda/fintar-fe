import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.model';
import { RoleRequest, RoleResponse } from '../models/role.model';
import { AssignPermissionsRequest, AssignPermissionsResponse } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/role`;

  getAll(): Observable<ApiResponse<RoleResponse[]>> {
    return this.http.get<ApiResponse<RoleResponse[]>>(this.API_URL);
  }

  getById(id: string): Observable<ApiResponse<RoleResponse>> {
    return this.http.get<ApiResponse<RoleResponse>>(`${this.API_URL}/${id}`);
  }

  create(request: RoleRequest): Observable<ApiResponse<RoleResponse>> {
    return this.http.post<ApiResponse<RoleResponse>>(this.API_URL, request);
  }

  update(id: string, request: RoleRequest): Observable<ApiResponse<RoleResponse>> {
    return this.http.put<ApiResponse<RoleResponse>>(`${this.API_URL}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }

  assignPermissions(roleId: string, request: AssignPermissionsRequest): Observable<ApiResponse<AssignPermissionsResponse>> {
    return this.http.post<ApiResponse<AssignPermissionsResponse>>(`${this.API_URL}/${roleId}/assign-permissions`, request);
  }

}
