import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatterService } from '../../core/services/date-formatter.service';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  constructor(private dateFormatter: DateFormatterService) {}

  transform(date: string | Date | null | undefined, format: 'backend' | 'display' | 'displayDateOnly' | 'displayTimeOnly' | 'html' | 'htmlDateTime' = 'display'): string {
    if (!date) return '';
    
    switch (format) {
      case 'backend':
        return this.dateFormatter.toBackendFormat(date);
      
      case 'display':
        return this.dateFormatter.toDisplayFormat(date);
      
      case 'displayDateOnly':
        return this.dateFormatter.toDisplayDateOnly(date);
      
      case 'displayTimeOnly':
        return this.dateFormatter.toDisplayTimeOnly(date);
      
      case 'html':
        return this.dateFormatter.toHtmlDateFormat(date);
        
      case 'htmlDateTime':
        return this.dateFormatter.toHtmlDateTimeFormat(date);
      
      default:
        return this.dateFormatter.toDisplayFormat(date);
    }
  }
}