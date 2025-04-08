import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Usuario, UserStatus } from '../models/user.model';
import { UsuarioService } from '../services/usuario.service';
import { SetoresFuncoesService } from '../services/setor-funcoes.service';
import { UserStatusStyleService } from '../services/user-status-style.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-visualizar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InfoCardComponent,
    DateFormatPipe
  ],
  providers: [DateFormatPipe],
  templateUrl: './visualizar-usuario.component.html',
  styleUrls: ['./visualizar-usuario.component.scss']
})
export class VisualizarUsuarioComponent implements OnInit {
  usuario: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  setorNomeUsuario: string = 'Carregando...'; // Variável global para o nome do setor
  funcaoNomeUsuario: string = 'Carregando...'; 

  constructor(
    private usuarioService: UsuarioService,
    private setoresFuncoesService: SetoresFuncoesService,
    private route: ActivatedRoute,
    private router: Router,
    private userStatusStyle: UserStatusStyleService,
    private dateFormatPipe: DateFormatPipe
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarUsuario(id);
    } else {
      this.error = 'ID do usuário não fornecido.';
      this.isLoading = false;
    }
  }

  carregarUsuario(id: string): void {
    this.isLoading = true;
    this.usuarioService.obterPorId(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;

          // Carregar o nome do setor
          this.setoresFuncoesService.getSetoresDicionario().subscribe({
            next: (setores) => {
              this.setorNomeUsuario = usuario.setor && setores[usuario.setor] || 'Não encontrado';
            },
            error: () => {
              this.setorNomeUsuario = 'Erro ao carregar setor';
            }
          });

          // Carregar o nome da função
          this.setoresFuncoesService.getFuncoesDicionario().subscribe({
            next: (funcoes) => {
              this.funcaoNomeUsuario = usuario.funcao && funcoes[usuario.funcao] || 'Não encontrada';
            },
            error: () => {
              this.funcaoNomeUsuario = 'Erro ao carregar função';
            }
          });
        },
        error: () => {
          this.error = 'Erro ao carregar dados do usuário.';
        }
      });
  }

  carregarNomeSetor(setorId: string | number): void {
    this.setoresFuncoesService.getSetorPorId(setorId).subscribe({
      next: (setor) => {
        this.setorNomeUsuario = setor?.nome || 'Não encontrado';
      },
      error: () => {
        this.setorNomeUsuario = 'Erro ao carregar setor';
      }
    });
  }

  carregarNomeFuncao(funcaoId: string | number): void {
    this.setoresFuncoesService.getFuncaoPorId(funcaoId).subscribe({
      next: (funcao) => {
        this.funcaoNomeUsuario = funcao?.nome || 'Não encontrada';
      },
      error: () => {
        this.funcaoNomeUsuario = 'Erro ao carregar função';
      }
    });
  }

  voltarParaLista(): void {
    this.router.navigate(['/usuarios']);
  }

  irParaEdicao(): void {
    if (this.usuario && this.usuario.id) {
      this.router.navigate(['/usuarios/editar', this.usuario.id]);
    }
  }

  // Métodos para lidar com o status
  getStatusClass(status: string): string {
    return this.userStatusStyle.getBadgeClass(status);
  }
  
  getStatusIcon(status: string): string {
    return this.userStatusStyle.getIcon(status);
  }
  
  getStatusTextClass(status: string): string {
    return this.userStatusStyle.getTextClass(status);
  }

  formatarData(data: string | Date | undefined): string {
    if (!data) {
      return 'Não informada';
    }
    
    try {
      // Remove any timezone information if present
      const cleanDate = data.toString().split('T')[0];
      const dataObj = new Date(cleanDate);
      
      // Check if date is valid
      if (isNaN(dataObj.getTime())) {
        return 'Data inválida';
      }
      
      // Format the date to Brazilian format
      return dataObj.toLocaleDateString('pt-BR');
    } catch (e) {
      console.error('Erro ao formatar data:', e, data);
      return 'Não informada';
    }
  }

  formatarEndereco(): string {
    if (!this.usuario) return 'Não informado';
    
    // Se não houver endereço, retornar mensagem informativa
    if (!this.usuario.endereco) return 'Endereço não cadastrado';
    
    const endereco = this.usuario.endereco;
    
    // Verificar se há alguma propriedade do endereço disponível
    const isEnderecoVazio = !endereco.logradouro?.trim() && !endereco.rua?.trim() &&
                            !endereco.numero?.trim() && !endereco.bairro?.trim() &&
                            !endereco.localidade?.trim() && !endereco.cidade?.trim();
    if (isEnderecoVazio) {
      return 'Endereço não cadastrado';
    }
    
    const logradouro = endereco.logradouro?.trim() || endereco.rua?.trim() || 'Logradouro não informado';
    
    let enderecoCompleto = `${logradouro}, ${endereco.numero?.trim() || 'S/N'}`;

    if (endereco.complemento?.trim()) {
      enderecoCompleto += ` - ${endereco.complemento.trim()}`;
    }

    enderecoCompleto += ` - ${endereco.bairro?.trim() || 'Bairro não informado'}, ${endereco.localidade?.trim() || endereco.cidade?.trim() || 'Cidade não informada'}/${endereco.uf?.trim() || endereco.estado?.trim() || 'UF não informado'}`;

    if (endereco.cep?.trim()) {
      enderecoCompleto += ` - CEP: ${this.formatarCep(endereco.cep.trim())}`;
    }

    return enderecoCompleto;
  }

  formatarCep(cep: string): string {
    if (!cep) return '';
    
    // Remove caracteres não numéricos
    const numeros = cep.replace(/\D/g, '');
    
    // Aplica a máscara de CEP: 00000-000
    if (numeros.length === 8) {
      return `${numeros.substring(0, 5)}-${numeros.substring(5)}`;
    }
    
    return cep;
  }

formatarRegistroProfissional(): string {
  if (!this.usuario) return 'Não informado';
  
  if (this.usuario.registroCategoria && this.usuario.registroNumero) {
    return `${this.usuario.registroCategoria}: ${this.usuario.registroNumero}`;
  } else if (this.usuario.registroCategoria) {
    return this.usuario.registroCategoria;
  }
  
  return 'Não informado';
}

  // Adicione este método na classe do componente
  getTipoContratacaoTexto(): string {
    if (!this.usuario) return 'Não informado';
    
    // Verificar se já temos o texto completo do tipo de contratação
    if (this.usuario.tipoContratacao) {
      return this.usuario.tipoContratacao;
    }
    
    // Se tivermos apenas o código, converter para o texto completo
    const tiposContratacao: Record<string, string> = {
      'c': 'Contratação Direta',
      't': 'Terceirizado',
      'p': 'Pessoa Jurídica'
    };
    
    // Tentar obter o tipo de contratação pelo código (tipo_contratacao)
    if (this.usuario.tipo_contratacao) {
      return tiposContratacao[this.usuario.tipo_contratacao] || this.usuario.tipo_contratacao;
    }
    
    return 'Não informado';
  }
}