import { LoanApplication, LoanDocument } from './loan.model';
import { RoleResponse } from './role.model';

export interface PlafondInfo {
    id: string;
    maxAmount: number;
    maxTenor: number;
    name: string;
}

export interface CustomerDetail {
    id: string;
    fullName: string;
    nationalId: string;
    phoneNumber: string;
    placeOfBirth: string;
    dateOfBirth: string;
    address: string;
    job: string;
    salary: number | null;
    citizenship: string;
    maritalStatus: string;
    houseStatus: string;
    religion: string;
    workplace: string;
    accountNumber: string;
    isMale: boolean;
    zipCode: string;
    remainPlafond: number | null;
    plafond: PlafondInfo;
    user: {
        id: string;
        username: string;
        email: string;
        roles: RoleResponse[];
    };
    documentResponses: LoanDocument[];
    loans?: LoanApplication[];
}
