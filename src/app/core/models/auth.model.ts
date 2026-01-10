export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
    token: string;
}
