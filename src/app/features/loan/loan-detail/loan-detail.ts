import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MessageService, ConfirmationService } from 'primeng/api';

// Core
import { LoanService } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoanApplication, LoanStatus, CustomerDetail, LoanDocument } from '../../../core/models/loan.model';
import { ApiResponse } from '../../../core/models/api.model';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-loan-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TagModule,
        TabsModule,
        ButtonModule,
        TableModule,
        SkeletonModule,
        DividerModule,
        ImageModule,
        ConfirmDialogModule,
        ToastModule,
        DialogModule,
        TextareaModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './loan-detail.html',
    styleUrl: './loan-detail.css'
})
export class LoanDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private loanService = inject(LoanService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    loanId = signal<string>('');
    loan = signal<LoanApplication | null>(null);
    customer = signal<CustomerDetail | null>(null);
    documents = signal<LoanDocument[]>([]);
    previousLoans = signal<LoanApplication[]>([]);
    loading = signal<boolean>(true);

    // Permissions
    canReview = signal<boolean>(false);
    canApprove = signal<boolean>(false);
    canDisburse = signal<boolean>(false);

    // Dialogs
    actionDialogVisible = signal<boolean>(false);
    currentAction = signal<'REVIEW' | 'APPROVE' | 'REJECT' | 'DISBURSE' | null>(null);
    actionNote = signal<string>('');
    actionLoading = signal<boolean>(false);

    baseUri = environment.apiUrl + "/document";

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loanId.set(id);
                this.loadData(id);
            }
        });
    }

    loadData(id: string): void {
        this.loading.set(true);
        this.loanService.getById(id).subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    this.loan.set(res.data.loan);
                    this.customer.set(res.data.customerDetail);
                    this.documents.set(res.data.documents || []);

                    this.checkPermissions();

                    if (res.data.customerDetail?.user?.id) {
                        this.loadPreviousLoans(res.data.customerDetail.user.id);
                    }
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading loan', err);
                this.loading.set(false);
            }
        });
    }

    checkPermissions(): void {
        const user = this.authService.getUser();
        const loan = this.loan();
        if (!user || !loan) return;

        const permissions = user.permissions || [];

        // Logic based on status and permission
        // REVIEW: Status CREATED, Permission REVIEW_LOAN
        if (loan.status === LoanStatus.CREATED && permissions.includes('REVIEW_LOAN')) {
            this.canReview.set(true);
        }

        // APPROVE/REJECT: Status REVIEWED, Permission APPROVE_LOAN
        if (loan.status === LoanStatus.REVIEWED && permissions.includes('APPROVE_LOAN')) {
            this.canApprove.set(true);
        }

        // DISBURSE: Status APPROVED, Permission DISBURSE_LOAN
        if (loan.status === LoanStatus.APPROVED && permissions.includes('DISBURSE_LOAN')) {
            this.canDisburse.set(true);
        }
    }

    loadPreviousLoans(customerId: string): void {
        this.loanService.getAll().subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    // const otherLoans = res.data.filter(l =>
                    //     (l.customerId === customerId) && l.id !== this.loanId()
                    // );
                    // this.previousLoans.set(otherLoans);
                }
            }
        });
    }

    getSeverity(status: LoanStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
        switch (status) {
            case LoanStatus.APPROVED: return 'success';
            case LoanStatus.REVIEWED: return 'info';
            case LoanStatus.CREATED: return 'warn';
            case LoanStatus.REJECTED: return 'danger';
            case LoanStatus.DISBURSED: return 'success';
            default: return 'secondary';
        }
    }

    goBack(): void {
        window.history.back();
    }

    // Actions
    openActionDialog(action: 'REVIEW' | 'APPROVE' | 'REJECT' | 'DISBURSE'): void {
        this.currentAction.set(action);
        this.actionNote.set('');
        this.actionDialogVisible.set(true);
    }

    submitAction(): void {
        const action = this.currentAction();
        const id = this.loanId();
        const note = this.actionNote();

        if (!action || !id) return;

        if (!note.trim() && action !== 'DISBURSE') {
            // Maybe force note for reject/approve? For now, optional or enforce
            // Requirement didn't specify, but typically Reject needs note.
            // I'll make it optional for Review/Approve unless logic requires.
            // Actually loan list had required note. Let's make it required for Reject at least.
            if (action === 'REJECT') {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Note is required for rejection' });
                return;
            }
        }

        this.actionLoading.set(true);
        let obs$;

        switch (action) {
            case 'REVIEW':
                obs$ = this.loanService.review(id, note);
                break;
            case 'APPROVE':
                obs$ = this.loanService.approve(id, note);
                break;
            case 'REJECT':
                obs$ = this.loanService.reject(id, note);
                break;
            case 'DISBURSE':
                obs$ = this.loanService.disburse(id, note);
                break;
            default:
                this.actionLoading.set(false);
                return;
        }

        obs$.subscribe({
            next: (res: ApiResponse<LoanApplication>) => {
                if (res.success) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Loan ${action} successful` });
                    this.actionDialogVisible.set(false);
                    // Reload data to refresh status and permissions
                    this.loadData(id);
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message || 'Action failed' });
                }
                this.actionLoading.set(false);
                this.goBack();
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
                this.actionLoading.set(false);
            }
        });
    }
}
