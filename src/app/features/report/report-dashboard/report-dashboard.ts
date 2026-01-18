import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ReportService } from '../../../core/services/report.service';
import { MonthNamePipe } from '../../../shared/pipe/month-name.pipe';

@Component({
    selector: 'app-report-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, CardModule, SkeletonModule],
    providers: [MonthNamePipe],
    templateUrl: './report-dashboard.html'
})
export class ReportDashboardComponent implements OnInit {
    private reportService = inject(ReportService);
    private monthNamePipe = inject(MonthNamePipe);

    pieData: any;
    pieOptions: any;

    barData: any;
    barOptions: any;

    productData: any;
    productOptions: any;

    kpis = signal<any>(null);
    loading = signal<boolean>(true);

    ngOnInit() {
        this.initCharts();
        this.loadData();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Pie Chart Options
        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

        // Bar Chart Options
        this.barOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        // Horizontal Bar for Products
        this.productOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    loadData() {
        this.loading.set(true);

        // Use forkJoin if real, but here we can just subscribe separately or chain
        // Since it's dummy synchronous-like

        this.reportService.getLoanStatusStats().subscribe(stats => {
            this.pieData = {
                labels: stats.map(s => s.status),
                datasets: [
                    {
                        data: stats.map(s => s.count),
                        backgroundColor: [
                            getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                            getComputedStyle(document.documentElement).getPropertyValue('--yellow-500'),
                            getComputedStyle(document.documentElement).getPropertyValue('--green-500'),
                            getComputedStyle(document.documentElement).getPropertyValue('--red-500'),
                            getComputedStyle(document.documentElement).getPropertyValue('--cyan-500')
                        ],
                        hoverBackgroundColor: [
                            getComputedStyle(document.documentElement).getPropertyValue('--blue-400'),
                            getComputedStyle(document.documentElement).getPropertyValue('--yellow-400'),
                            getComputedStyle(document.documentElement).getPropertyValue('--green-400'),
                            getComputedStyle(document.documentElement).getPropertyValue('--red-400'),
                            getComputedStyle(document.documentElement).getPropertyValue('--cyan-400')
                        ]
                    }
                ]
            };
        });

        this.reportService.getDisbursementStats().subscribe(response => {
            let stats = response.data;
            this.barData = {
                labels: stats.map(s => this.monthNamePipe.transform(s.month) + " " + s.year),
                datasets: [
                    {
                        label: 'Disbursement Amount (IDR)',
                        data: stats.map(s => s.amount),
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-500'),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-500'),
                        borderWidth: 1
                    }
                ]
            };
        });

        this.reportService.getBestSellingProducts().subscribe(stats => {
            this.productData = {
                labels: stats.map(s => s.product),
                datasets: [
                    {
                        label: 'Applications',
                        data: stats.map(s => s.count),
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--teal-500'),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--teal-500'),
                        borderWidth: 1
                    }
                ]
            };
        });

        this.reportService.getMonthKPIs().subscribe(response => {
            this.kpis.set(response.data);
            // Assuming this is last call or enough to stop loading
            this.loading.set(false);
        });
    }
}
