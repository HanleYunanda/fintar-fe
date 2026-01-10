import { RoleResponse } from './role.model';

export interface User {
    id: string;
    username: string;
    email: string;
    roles: RoleResponse[];  // Changed from string[] to RoleResponse[]
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    roles: string[];  // Request still uses string array
}

export interface UpdateUserRequest {
    username?: string;
    email?: string;
    password?: string;
    roles?: string[];  // Request still uses string array
}

// Password validation pattern: min 8 chars, 1 uppercase, 1 lowercase, 1 digit
export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
export const PASSWORD_ERROR_MESSAGE = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit';
