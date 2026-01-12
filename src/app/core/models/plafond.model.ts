export interface Plafond {
    id: string;
    name: string;
    maxAmount: number;
    maxTenor: number;
}

export interface CreatePlafondRequest {
    name: string;
    maxAmount: number;
    maxTenor: number;
}

export interface UpdatePlafondRequest {
    name: string;
    maxAmount: number;
    maxTenor: number;
}