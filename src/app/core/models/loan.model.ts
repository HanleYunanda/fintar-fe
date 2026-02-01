import { Product } from './product.model';

export enum LoanStatus {
    CREATED = 'CREATED',
    REVIEWED = 'REVIEWED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    DISBURSED = 'DISBURSED'
}

export interface LoanStatusHistory {
    id: string;
    action: LoanStatus;
    note: string;
    performedBy: {
        username: string;
        email: string;
    };
    performedAt: Date;
}

export interface LoanApplication {
    id: string;
    status: LoanStatus;
    principalDebt: number;
    outstandingDebt: number;
    tenor: number;
    interestRate: number;
    installmentPayment: number;
    product: Product;
    loanStatusHistories: LoanStatusHistory[];
    createdAt: Date;
    latitude?: number;
    longitude?: number;
}

export interface CreateLoanRequest {
    productId: string;
    principalDebt: number;
    tenor: number;
}

export interface LoanDocument {
    id: string;
    filename: string;
    fileUri: string;
    docType: string;
    contentType: string;
    size: number | null;
}

export interface CustomerDetail {
    id: string;
    fullName: string;
    nationalId: string;
    phoneNumber: string;
    placeOfBirth: string;
    dateOfBirth: Date;
    address: string;
    job: string;
    salary: number;
    citizenship: string;
    maritalStatus: string;
    houseStatus: string;
    religion: string;
    workplace: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export interface LoanDetailResponse {
    customerDetail: CustomerDetail;
    documents: LoanDocument[];
    loan: LoanApplication;
    loanStatusHistories: LoanStatusHistory[];
}

export interface LoanActionRequest {
    action: string;
    note: string;
}
