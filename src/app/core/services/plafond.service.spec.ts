import '@angular/compiler';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

import { PlafondService } from './plafond.service';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import {
    CreatePlafondRequest,
    UpdatePlafondRequest,
    PlafondOrderRequest,
    Plafond,
} from '../models/plafond.model';
import { ApiResponse } from '../models/api.model';

describe('PlafondService', () => {
    let service: PlafondService;
    let httpClientSpy: {
        get: ReturnType<typeof vi.fn>;
        post: ReturnType<typeof vi.fn>;
        put: ReturnType<typeof vi.fn>;
        patch: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };
    const apiUrl = `${environment.apiUrl}/plafond`;

    beforeEach(() => {
        httpClientSpy = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        };

        const injector = Injector.create({
            providers: [
                { provide: HttpClient, useValue: httpClientSpy },
                { provide: PlatformLocation, useValue: {} },
                PlafondService,
            ],
        });

        service = injector.get(PlafondService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAll', () => {
        it('should retrieve all plafonds', () => {
            const mockPlafonds: Plafond[] = [
                { id: '1', name: 'Silver', maxAmount: 1000000, maxTenor: 12, nextPlafondLimit: 2000000 } as Plafond,
                { id: '2', name: 'Gold', maxAmount: 5000000, maxTenor: 24, nextPlafondLimit: 10000000 } as Plafond,
            ];
            const mockResponse: ApiResponse<Plafond[]> = {
                data: mockPlafonds,
                success: true,
                message: 'Success',
                code: 200,
                timestamp: new Date(),
            };

            httpClientSpy.get.mockReturnValue(of(mockResponse));

            service.getAll().subscribe((response) => {
                expect(response.data.length).toBe(2);
                expect(response.data).toEqual(mockPlafonds);
            });

            expect(httpClientSpy.get).toHaveBeenCalledWith(apiUrl);
        });
    });

    describe('getActive', () => {
        it('should retrieve active plafonds', () => {
            const mockPlafonds: Plafond[] = [
                { id: '1', name: 'Silver', maxAmount: 1000000, maxTenor: 12, nextPlafondLimit: 2000000 } as Plafond,
            ];
            const mockResponse: ApiResponse<Plafond[]> = {
                data: mockPlafonds,
                success: true,
                message: 'Success',
                code: 200,
                timestamp: new Date(),
            };

            httpClientSpy.get.mockReturnValue(of(mockResponse));

            service.getActive().subscribe((response) => {
                expect(response.data.length).toBe(1);
                expect(response.data).toEqual(mockPlafonds);
            });

            expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/active`);
        });
    });

    describe('getById', () => {
        it('should retrieve a plafond by id', () => {
            const mockPlafond: Plafond = { id: '1', name: 'Silver', maxAmount: 1000000, maxTenor: 12, nextPlafondLimit: 2000000 } as Plafond;
            const mockResponse: ApiResponse<Plafond> = {
                data: mockPlafond,
                success: true,
                message: 'Success',
                code: 200,
                timestamp: new Date(),
            };

            httpClientSpy.get.mockReturnValue(of(mockResponse));

            service.getById('1').subscribe((response) => {
                expect(response.data).toEqual(mockPlafond);
            });

            expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1`);
        });
    });

    describe('create', () => {
        it('should create a new plafond', () => {
            const request: CreatePlafondRequest = { name: 'Platinum', maxAmount: 10000000, maxTenor: 36, nextPlafondLimit: 20000000 };
            const mockPlafond: Plafond = { id: '3', ...request } as Plafond;
            const mockResponse: ApiResponse<Plafond> = {
                data: mockPlafond,
                success: true,
                message: 'Created',
                code: 201,
                timestamp: new Date(),
            };

            httpClientSpy.post.mockReturnValue(of(mockResponse));

            service.create(request).subscribe((response) => {
                expect(response.data).toEqual(mockPlafond);
            });

            expect(httpClientSpy.post).toHaveBeenCalledWith(apiUrl, request);
        });
    });

    describe('update', () => {
        it('should update an existing plafond', () => {
            const request: UpdatePlafondRequest = { name: 'Silver Updated' } as any;
            const mockPlafond: Plafond = { id: '1', name: 'Silver Updated', maxAmount: 1000000, maxTenor: 12, nextPlafondLimit: 2000000 } as Plafond;
            const mockResponse: ApiResponse<Plafond> = {
                data: mockPlafond,
                success: true,
                message: 'Updated',
                code: 200,
                timestamp: new Date(),
            };

            httpClientSpy.put.mockReturnValue(of(mockResponse));

            service.update('1', request).subscribe((response) => {
                expect(response.data).toEqual(mockPlafond);
            });

            expect(httpClientSpy.put).toHaveBeenCalledWith(`${apiUrl}/1`, request);
        });
    });

    describe('updateOrders', () => {
        it('should update plafond orders', () => {
            const requests: PlafondOrderRequest[] = [{ id: '1', order: 2 }];
            const mockResponse: ApiResponse<void> = {
                data: undefined,
                success: true,
                message: 'Orders Updated',
                code: 200,
                timestamp: new Date(),
            };

            httpClientSpy.patch.mockReturnValue(of(mockResponse));

            service.updateOrders(requests).subscribe((response) => {
                expect(response.success).toBeTrue();
            });

            expect(httpClientSpy.patch).toHaveBeenCalledWith(`${apiUrl}/orders`, requests);
        });
    });

    describe('delete', () => {
        it('should delete a plafond', () => {
            const mockResponse: ApiResponse<string> = {
                data: 'Deleted',
                success: true,
                message: 'Deleted',
                code: 200,
                timestamp: new Date(),
            };

            httpClientSpy.delete.mockReturnValue(of(mockResponse));

            service.delete('1').subscribe((response) => {
                expect(response.data).toBe('Deleted');
            });

            expect(httpClientSpy.delete).toHaveBeenCalledWith(`${apiUrl}/1`);
        });
    });
});
