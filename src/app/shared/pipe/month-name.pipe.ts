import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName',
  standalone: true
})
export class MonthNamePipe implements PipeTransform {

  private readonly months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  transform(month: number | string | null | undefined): string {
    if (typeof month === 'string') month = Number(month);
    if (!month || month < 1 || month > 12) return '-';

    return this.months[month - 1];
  }
}
