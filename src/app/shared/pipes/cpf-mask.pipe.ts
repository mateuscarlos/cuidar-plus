import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfMask',
  standalone: true
})
export class CpfMaskPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Remove todos os caracteres não numéricos
    const cpf = value.replace(/\D/g, '');
    
    // Verifica se tem os 11 dígitos esperados
    if (cpf.length !== 11) {
      return value; // Retorna o valor original se não tiver 11 dígitos
    }
    
    // Aplica a máscara: 123.456.789-00
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}