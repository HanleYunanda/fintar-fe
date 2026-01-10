import { Permission } from "./permission.model";

export interface RoleRequest {
    name: string;
}

export interface RoleResponse {
    id: string;
    name: string;
    permissions: Permission[];
}
