import { Plafond } from './plafond.model';

export interface Product {
    id: string;
    plafond: Plafond;
    tenor: number;
    interestRate: number;
}

export interface CreateProductRequest {
    plafondId: string;
    tenor: number;
    interestRate: number;
}
