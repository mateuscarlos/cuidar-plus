/**
 * Provider Service
 * Serviço para operações de Prestadoras de Serviço
 */

import { 
  Provider, 
  CreateProviderDTO, 
  UpdateProviderDTO, 
  ProviderFilters,
  ProviderStatus
} from '../domain';

export class ProviderService {
  /**
   * Lista todas as prestadoras com filtros opcionais
   */
  static async findAll(filters?: ProviderFilters): Promise<Provider[]> {
    // TODO: Implementar chamada real à API
    const { getProvidersMock } = await import('./provider.mock');
    return getProvidersMock();
  }

  /**
   * Busca uma prestadora por ID
   */
  static async findById(id: string): Promise<Provider | null> {
    const providers = await this.findAll();
    return providers.find(provider => provider.id === id) || null;
  }

  /**
   * Cria uma nova prestadora
   */
  static async create(dto: CreateProviderDTO): Promise<Provider> {
    // TODO: Implementar chamada real à API
    console.log('Creating provider:', dto);
    
    const newProvider: Provider = {
      id: crypto.randomUUID(),
      ...dto,
      services: dto.services || [],
      acceptedInsurers: dto.acceptedInsurers || [],
      status: ProviderStatus.PENDING_APPROVAL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newProvider;
  }

  /**
   * Atualiza uma prestadora existente
   */
  static async update(id: string, dto: UpdateProviderDTO): Promise<Provider> {
    // TODO: Implementar chamada real à API
    console.log('Updating provider:', id, dto);
    
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Prestadora não encontrada');
    }
    
    return {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Remove uma prestadora
   */
  static async delete(id: string): Promise<void> {
    // TODO: Implementar chamada real à API
    console.log('Deleting provider:', id);
  }

  /**
   * Busca prestadoras por nome ou especialidade
   */
  static async search(query: string): Promise<Provider[]> {
    const providers = await this.findAll();
    return providers.filter(provider => 
      provider.name.toLowerCase().includes(query.toLowerCase()) ||
      provider.tradeName.toLowerCase().includes(query.toLowerCase()) ||
      provider.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))
    );
  }

  /**
   * Busca prestadoras que aceitam uma operadora específica
   */
  static async findByInsurer(insurerId: string): Promise<Provider[]> {
    const providers = await this.findAll();
    return providers.filter(provider => 
      provider.acceptedInsurers.includes(insurerId)
    );
  }
}
