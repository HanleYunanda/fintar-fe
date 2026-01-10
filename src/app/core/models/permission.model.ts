export interface Permission {
    id: string;
    code: string;
}

export interface PermissionRequest {
    code: string;
}

export interface AssignPermissionsRequest {
    permissionCodes: string[];
}

export interface AssignPermissionsResponse {
    role: {
        id: string;
        name: string;
    };
    permissions: Permission[];
}
