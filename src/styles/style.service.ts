import { Injectable } from '@angular/core';
import { StatusStyleService } from './status-style.service';

@Injectable({
  providedIn: 'root'
})
export class AppStyleService {
  constructor(private statusStyleService: StatusStyleService) {}

  /**
   * Retorna classes Bootstrap para botões padrão
   * @param variant Variante do botão (primary, secondary, etc)
   * @param size Tamanho do botão (sm, lg)
   * @param outline Se o botão é outline
   */
  getButtonClasses(variant: string = 'primary', size?: string, outline: boolean = false): string {
    let classes = `btn ${outline ? 'btn-outline-' : 'btn-'}${variant}`;
    if (size) classes += ` btn-${size}`;
    return classes;
  }

  /**
   * Retorna classes Bootstrap para cards
   * @param variant Variante do card
   */
  getCardClasses(variant?: string): string {
    let classes = 'card';
    if (variant) classes += ` border-${variant} bg-${variant}-subtle`;
    return classes;
  }

  /**
   * Retorna classes para badges
   * @param status Status a ser utilizado
   */
  getBadgeClasses(status: string): string {
    return this.statusStyleService.getStatusStyle(status)?.badgeClass || 'bg-secondary';
  }

  /**
   * Retorna classes para ícones com tamanho
   * @param icon Nome do ícone (sem o prefixo bi-) 
   * @param size Tamanho (fs-1 até fs-6)
   */
  getIconClasses(icon: string, size: string = 'fs-5'): string {
    return `bi bi-${icon} ${size}`;
  }
}