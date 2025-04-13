import { UsuarioAdapter } from './user.model';

describe('UsuarioAdapter', () => {
  it('deve formatar o status corretamente', () => {
    expect(UsuarioAdapter.formatarStatus('ATIVO')).toBe('Ativo');
    expect(UsuarioAdapter.formatarStatus('INATIVO')).toBe('Inativo');
    expect(UsuarioAdapter.formatarStatus('FERIAS')).toBe('Férias');
    expect(UsuarioAdapter.formatarStatus(undefined)).toBe('Não informado');
  });

  it('deve formatar o tipo de contratação corretamente', () => {
    expect(UsuarioAdapter.formatarTipoContratacao('c')).toBe('Contratada');
    expect(UsuarioAdapter.formatarTipoContratacao('t')).toBe('Terceirizada');
    expect(UsuarioAdapter.formatarTipoContratacao('p')).toBe('Pessoa Jurídica');
    expect(UsuarioAdapter.formatarTipoContratacao(undefined)).toBe('Não informado');
  });

  it('deve formatar o tipo de acesso corretamente', () => {
    expect(UsuarioAdapter.formatarTipoAcesso('admin')).toBe('Administrador');
    expect(UsuarioAdapter.formatarTipoAcesso('gestor')).toBe('Gestor');
    expect(UsuarioAdapter.formatarTipoAcesso('padrao')).toBe('Padrão');
    expect(UsuarioAdapter.formatarTipoAcesso(undefined)).toBe('Não informado');
  });
});