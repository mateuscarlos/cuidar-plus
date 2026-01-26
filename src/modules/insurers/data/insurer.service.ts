/**
 * Insurer Service
 * Serviço para operações de Operadoras de Saúde
 */

import { 
  Insurer, 
  CreateInsurerDTO, 
  UpdateInsurerDTO, 
  InsurerFilters,
  InsurerStatus
} from '../domain';

export class InsurerService {
  /**
   * Lista todas as operadoras com filtros opcionais
   */
  static async findAll(filters?: InsurerFilters): Promise<Insurer[]> {
    // TODO: Implementar chamada real à API
    const { getInsurersMock } = await import('./insurer.mock');
    return getInsurersMock();
  }

  /**
   * Busca uma operadora por ID
   */
  static async findById(id: string): Promise<Insurer | null> {
    const insurers = await this.findAll();
    return insurers.find(insurer => insurer.id === id) || null;
  }

  /**
   * Cria uma nova operadora
   */
  static async create(dto: CreateInsurerDTO): Promise<Insurer> {
    // TODO: Implementar chamada real à API
    console.log('Creating insurer:', dto);
    
    const newInsurer: Insurer = {
      id: crypto.randomUUID(),
      ...dto,
      plans: dto.plans || [],
      status: InsurerStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newInsurer;
  }

  /**
   * Atualiza uma operadora existente
   */
  static async update(id: string, dto: UpdateInsurerDTO): Promise<Insurer> {
    // TODO: Implementar chamada real à API
    console.log('Updating insurer:', id, dto);
    
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Operadora não encontrada');
    }
    
    return {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Remove uma operadora
   */
  static async delete(id: string): Promise<void> {
    // TODO: Implementar chamada real à API
    console.log('Deleting insurer:', id);
  }

  /**
   * Busca operadoras por nome
   */
  static async searchByName(name: string): Promise<Insurer[]> {
    const insurers = await this.findAll();
    return insurers.filter(insurer => 
      insurer.name.toLowerCase().includes(name.toLowerCase()) ||
      insurer.tradeName.toLowerCase().includes(name.toLowerCase())
    );
  }
}
