import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ]
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() id = `date-input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() help = '';
  @Input() showTime = false;
  @Input() name = '';

  @Output() dateChange = new EventEmitter<string>();

  inputValue = '';
  
  constructor(private dateFormatter: DateFormatterService) {}

  // Implementação da interface ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};
  
  /**
   * Chamado quando o valor muda externamente
   */
  writeValue(value: string | Date | null): void {
    if (value) {
      // Converte para o formato adequado para o input HTML
      this.inputValue = this.showTime 
        ? this.dateFormatter.toHtmlDateTimeFormat(value)
        : this.dateFormatter.toHtmlDateFormat(value);
    } else {
      this.inputValue = '';
    }
  }
  
  /**
   * Registra o método de alteração
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  /**
   * Registra o método de toque
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  /**
   * Define o estado de desabilitado
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  /**
   * Chamado quando o valor muda no input
   */
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.inputValue = value;
    
    // Converte de formato HTML para o formato do backend para o formulário
    const backendFormat = this.showTime
      ? this.dateFormatter.toBackendFormat(value)
      : this.dateFormatter.toBackendDateOnlyFormat(value);
    
    this.onChange(backendFormat);
    this.dateChange.emit(backendFormat);
  }
}