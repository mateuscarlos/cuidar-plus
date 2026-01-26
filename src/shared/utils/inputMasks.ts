/**
 * Input Mask Utilities
 * Funções utilitárias para aplicar máscaras em inputs
 */

/**
 * Aplica máscara de CPF (###.###.###-##)
 */
export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Remove máscara e retorna apenas números
 */
export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Aplica máscara de CEP (#####-###)
 */
export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
}

/**
 * Remove máscara e retorna apenas números
 */
export function unmaskCEP(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Aplica máscara de telefone (##) #####-####
 */
export function maskPhone(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

/**
 * Remove máscara e retorna apenas números
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Valida CPF
 */
export function isValidCPF(cpf: string): boolean {
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (cleanCpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit = remainder >= 10 ? 0 : remainder;
  if (digit !== parseInt(cleanCpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  digit = remainder >= 10 ? 0 : remainder;
  if (digit !== parseInt(cleanCpf.charAt(10))) return false;
  
  return true;
}
