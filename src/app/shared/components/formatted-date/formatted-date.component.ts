import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-formatted-date',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  template: `
    <span [title]="getFullDate()">{{ date | dateFormat: format }}</span>
  `
})
export class FormattedDateComponent {
  @Input() date: string | Date | null | undefined;
  @Input() format: 'display' | 'displayDateOnly' | 'displayTimeOnly' | 'backend' | 'html' = 'display';
  
  constructor(private dateFormatPipe: DateFormatPipe) {}
  
  getFullDate(): string {
    return this.dateFormatPipe.transform(this.date, 'display');
  }
}