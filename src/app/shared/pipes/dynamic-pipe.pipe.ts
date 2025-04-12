import { Pipe, PipeTransform, Injector } from '@angular/core';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';

@Pipe({
  name: 'dynamicPipe',
  standalone: true
})
export class DynamicPipePipe implements PipeTransform {
  private datePipe: DatePipe;
  private currencyPipe: CurrencyPipe;
  private decimalPipe: DecimalPipe;

  constructor(private injector: Injector) {
    this.datePipe = new DatePipe('pt-BR');
    this.currencyPipe = new CurrencyPipe('pt-BR');
    this.decimalPipe = new DecimalPipe('pt-BR');
  }

  transform(value: any, pipeName: string, args?: any[]): any {
    if (!value) return '';
    
    switch (pipeName) {
      case 'date':
        const dateFormat = args && args.length > 0 ? args[0] : 'dd/MM/yyyy';
        return this.datePipe.transform(value, dateFormat);
      
      case 'currency':
        const currencyCode = args && args.length > 0 ? args[0] : 'BRL';
        const display = args && args.length > 1 ? args[1] : 'symbol';
        const digitsInfo = args && args.length > 2 ? args[2] : '1.2-2';
        return this.currencyPipe.transform(value, currencyCode, display, digitsInfo);
      
      case 'number':
        const digitInfo = args && args.length > 0 ? args[0] : '1.2-2';
        return this.decimalPipe.transform(value, digitInfo);
      
      case 'cpf':
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      
      case 'cnpj':
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      
      case 'phone':
        if (value.length === 11) {
          return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      
      default:
        return value;
    }
  }
}