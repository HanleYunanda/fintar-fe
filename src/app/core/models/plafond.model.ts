export interface Plafond {
  id: string;
  name: string;
  maxAmount: number;
  maxTenor: number;
  orderNumber?: number;
  nextPlafondLimit: number;
}

export interface PlafondOrderRequest {
  id: string;
  orderNumber: number;
}

export interface CreatePlafondRequest {
  name: string;
  maxAmount: number;
  maxTenor: number;
  nextPlafondLimit: number;
}

export interface UpdatePlafondRequest {
  name: string;
  maxAmount: number;
  maxTenor: number;
  nextPlafondLimit: number;
}
