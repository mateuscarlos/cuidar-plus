import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { finalize, catchError, tap, of } from 'rxjs';

import { Usuario, UsuarioAdapter } from '../models/user.model';
import { UsuarioService } from '../services/usuario.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { ConselhoProfissional, FUNCOES_DETALHES, FuncoesComRegistro, 
         SETOR_CONSELHO_MAP, SetorProfissional } from '../models/conselhos-profissionais.model';

import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UsuarioAvatarComponent } from '../../../shared/components/usuario-avatar/usuario-avatar.component';
import { FormattedDateComponent } from '../../../shared/components/formatted-date/formatted-date.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-visualizar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InfoCardComponent,
    StatusBadgeComponent,
    UsuarioAvatarComponent,
    FormattedDateComponent,
    DateFormatPipe
  ],
  providers: [DateFormatPipe],
  templateUrl: './visualizar-usuario.component.html',
  styleUrls: ['./visualizar-usuario.component.scss']
})
export class VisualizarUsuarioComponent implements OnInit {
  // Dados principais
  usuario: Usuario | null = null;
  
  // Estados da UI
  isLoading = true;
  error: string | null = null;
  
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private notificacaoService: NotificacaoService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.carregarUsuarioPorId(params['id']);
      } else {
        // Verificar se há um ID nos query params
        this.route.queryParams.subscribe(queryParams => {
          if (queryParams['usuarioId']) {
            this.carregarUsuarioPorId(queryParams['usuarioId']);
          } else {
            this.error = 'ID do usuário não fornecido';
            this.isLoading = false;
          }
        });
      }
    });
  }
  
  /**
   * Carrega os dados de um usuário pelo ID
   */
  carregarUsuarioPorId(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.usuarioService.obterUsuarioPorId(id)
      .pipe(
        tap(usuario => {
          if (usuario) {
            console.log('Usuário recebido da API:', JSON.stringify(usuario));
            this.usuario = usuario;
            
            console.log('Setor recebido:', usuario.setor, 'Nome do setor:', usuario.setorNome);
            console.log('Função recebida:', usuario.funcao, 'Nome da função:', usuario.funcaoNome);
            
            // Após carregar o usuário, verificamos se precisamos obter o nome do setor e função
            if (usuario.setor && !usuario.setorNome) {
              console.log('Obtendo nome do setor para ID:', usuario.setor);
              this.obterNomeDoSetor(usuario.setor);
            }
            
            if (usuario.funcao && !usuario.funcaoNome) {
              console.log('Obtendo nome da função para ID:', usuario.funcao);
              this.obterNomeDaFuncao(usuario.funcao);
            }
          } else {
            this.error = 'Usuário não encontrado';
            this.notificacaoService.mostrarAviso('Usuário não encontrado.');
          }
        }),
        catchError(erro => {
          this.error = 'Erro ao carregar dados do usuário';
          this.notificacaoService.mostrarErro('Erro ao carregar dados do usuário.');
          console.error('Erro ao carregar usuário:', erro);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
  
  /**
   * Obtém o nome do setor usando o serviço
   */
  private obterNomeDoSetor(setorId: string | number): void {
    // Verifica primeiro se é um setor mapeado nos conselhos
    const setorNumerico = Number(setorId);
    if (!isNaN(setorNumerico)) {
      // Verifica se o setor está no mapeamento
      for (const key in SetorProfissional) {
        if (Number(SetorProfissional[key]) === setorNumerico) {
          if (this.usuario) {
            this.usuario.setorNome = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            return;
          }
        }
      }
    }
    
    // Se não encontrou nos mapeamentos, busca no serviço
    this.usuarioService.obterNomeSetor(setorId).subscribe(nome => {
      if (this.usuario) {
        this.usuario.setorNome = nome;
      }
    });
  }
  
  /**
   * Obtém o nome da função usando o serviço ou o mapeamento
   */
  private obterNomeDaFuncao(funcaoId: string | number): void {
    // Verifica primeiro se é uma função mapeada nos conselhos
    const funcaoNumerica = Number(funcaoId);
    if (!isNaN(funcaoNumerica)) {
      // Verifica se a função está no mapeamento de detalhes
      const detalhe = this.obterDetalhesFuncao();
      if (detalhe && detalhe.nome) {
        if (this.usuario) {
          this.usuario.funcaoNome = detalhe.nome;
          return;
        }
      }
    }
    
    // Se não encontrou nos mapeamentos, busca no serviço
    this.usuarioService.obterNomeFuncao(funcaoId)
      .pipe(
        catchError(erro => {
          console.error('Erro ao obter nome da função:', erro);
          // Fornecer um valor fallback quando a API falha
          return of(`Função ${funcaoId}`);
        })
      )
      .subscribe(nome => {
        if (this.usuario) {
          this.usuario.funcaoNome = nome;
        }
      });
  }
  
  /**
   * Determina o nome do conselho com base na função e setor
   */
  obterNomeConselho(): string {
    if (!this.usuario) return 'Registro Profissional';
    
    // Verificamos primeiro pelos detalhes da função
    const detalhesFuncao = this.obterDetalhesFuncao();
    if (detalhesFuncao && detalhesFuncao.conselho) {
      return detalhesFuncao.conselho;
    }
    
    // Se não encontramos pelos detalhes, usamos o método padrão
    return UsuarioAdapter.obterNomeConselho(
      this.usuario.funcao,
      this.usuario.setor
    );
  }
  
  /**
   * Formata um endereço para exibição
   */
  formatarEndereco(endereco: any): string {
    if (!endereco) {
      return 'Não informado';
    }

    const logradouro = endereco.logradouro || endereco.rua || 'Logradouro não informado';
    
    let enderecoCompleto = `${logradouro}, ${endereco.numero || 'S/N'}`;

    if (endereco.complemento) {
      enderecoCompleto += ` - ${endereco.complemento}`;
    }
    
    // Cidade e Estado podem estar em campos diferentes dependendo da fonte
    const cidade = endereco.cidade || endereco.localidade || 'Cidade não informada';
    const estado = endereco.estado || endereco.uf || 'UF não informado';
    const bairro = endereco.bairro || 'Bairro não informado';
    
    const cep = this.formatarCep(endereco.cep || '');

    enderecoCompleto += ` - ${bairro}, ${cidade}/${estado} - ${cep}`;

    return enderecoCompleto;
  }
  
  /**
   * Formata um CEP para exibição
   */
  formatarCep(cep: string): string {
    if (!cep) return 'Não informado';
    
    // Remove caracteres não numéricos
    const numeros = cep.replace(/\D/g, '');
    
    // Aplica a máscara de CEP: 00000-000
    if (numeros.length === 8) {
      return `${numeros.substring(0, 5)}-${numeros.substring(5)}`;
    }
    
    return cep;
  }
  
  /**
   * Formata uma data para exibição
   */
  formatarData(data: string | undefined): string {
    if (!data) {
      return 'Não informado';
    }
    
    try {
      // Remove informações de timezone se presentes
      const cleanDate = data.toString().split('T')[0];
      const dataObj = new Date(cleanDate);
      
      // Verifica se a data é válida
      if (isNaN(dataObj.getTime())) {
        return 'Data inválida';
      }
      
      // Formata para o padrão brasileiro
      return dataObj.toLocaleDateString('pt-BR');
    } catch (e) {
      return 'Data inválida';
    }
  }
  
  /**
   * Navega para a página de edição do usuário
   */
  irParaEdicao(): void {
    if (this.usuario && this.usuario.id) {
      this.router.navigate(['/usuarios/editar', this.usuario.id]);
    } else {
      this.notificacaoService.mostrarErro('Não é possível editar: usuário não encontrado ou sem ID.');
    }
  }
  
  /**
   * Navega de volta para a lista de usuários
   */
  voltarParaLista(): void {
    this.router.navigate(['/usuarios']);
  }
  
  /**
   * Verifica se a função do usuário requer registro em conselho profissional
   */
  funcaoRequerRegistro(): boolean {
    if (!this.usuario || !this.usuario.funcao) return false;
    
    const funcaoId = Number(this.usuario.funcao);
    return !isNaN(funcaoId) && funcaoId in FUNCOES_DETALHES;
  }
  
  /**
   * Obtém os detalhes da função do usuário, se disponíveis
   */
  obterDetalhesFuncao() {
    if (!this.usuario || !this.usuario.funcao) return null;
    return UsuarioAdapter.obterDetalhesFuncao(this.usuario.funcao);
  }

  /**
   * Verifica se a informação de registro deve ser exibida
   */
  temRegistro(): boolean {
    return !!this.usuario?.registro_categoria && this.usuario.registro_categoria.trim() !== '';
  }
  /**
   * Verifica se a informação de especialidade deve ser exibida
   */
  temEspecialidade(): boolean {
    return !!this.usuario?.especialidade && this.usuario.especialidade.trim() !== '';
  }
}