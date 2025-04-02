import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Validador de CPF
  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value;
      
      if (!cpf) {
        return null;
      }
      
      // Remove caracteres não numéricos
      const cleanCpf = cpf.toString().replace(/\D/g, '');
      
      // Verifica se tem 11 dígitos
      if (cleanCpf.length !== 11) {
        return { cpfInvalido: true };
      }
      
      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cleanCpf)) {
        return { cpfInvalido: true };
      }
      
      // Validação dos dígitos verificadores
      let soma = 0;
      let resto;
      
      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
      }
      
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cleanCpf.substring(9, 10))) {
        return { cpfInvalido: true };
      }
      
      soma = 0;
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
      }
      
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cleanCpf.substring(10, 11))) {
        return { cpfInvalido: true };
      }
      
      return null;
    };
  }
  
  // Validador de CEP
  static cep(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cep = control.value;
      
      if (!cep) {
        return null;
      }
      
      // Remove caracteres não numéricos
      const cleanCep = cep.toString().replace(/\D/g, '');
      
      // Verifica se tem 8 dígitos
      if (cleanCep.length !== 8) {
        return { cepInvalido: true };
      }
      
      return null;
    };
  }
  
  // Data futura
  static dataFutura(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const data = control.value;
      
      if (!data) {
        return null;
      }
      
      const dataControle = new Date(data);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataControle < hoje) {
        return { dataFutura: true };
      }
      
      return null;
    };
  }
  
  // Data passada
  static dataPassada(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const data = control.value;
      
      if (!data) {
        return null;
      }
      
      const dataControle = new Date(data);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataControle > hoje) {
        return { dataPassada: true };
      }
      
      return null;
    };
  }
  
  // Validador de idade mínima
  static idadeMinima(idadeMinima: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const data = control.value;
      
      if (!data) {
        return null;
      }
      
      const dataNascimento = new Date(data);
      const hoje = new Date();
      
      let idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const m = hoje.getMonth() - dataNascimento.getMonth();
      
      if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
      }
      
      if (idade < idadeMinima) {
        return { idadeMinima: { required: idadeMinima, actual: idade } };
      }
      
      return null;
    };
  }
}