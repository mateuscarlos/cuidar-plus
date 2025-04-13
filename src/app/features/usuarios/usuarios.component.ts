import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { UsuarioEstatisticasService } from './services/usuario-estatisticas.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatusBadgeComponent,
    HttpClientModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  isLoading = true;
  totalUsuarios = 0;
  usuariosAtivos = 0;
  totalAdmins = 0;
  usuariosInativos = 0;
  
  constructor(
    private router: Router,
    private usuarioEstatisticasService: UsuarioEstatisticasService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.isLoading = true;
    
    this.usuarioEstatisticasService.getEstatisticas()
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar estatísticas:', error);
          this.toastService.showError('Não foi possível carregar as estatísticas de usuários.');
          // Retornar valores padrão em caso de erro
          return of({
            totalUsuarios: 0,
            usuariosAtivos: 0,
            totalAdmins: 0,
            usuariosInativos: 0
          });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        this.totalUsuarios = data.totalUsuarios;
        this.usuariosAtivos = data.usuariosAtivos;
        this.totalAdmins = data.totalAdmins;
        this.usuariosInativos = data.usuariosInativos;
      });
  }

  navegarParaLista(): void {
    this.router.navigate(['/usuarios/lista']);
  }

  navegarParaCadastro(): void {
    this.router.navigate(['/usuarios/cadastrar']);
  }

  navegarParaBusca(): void {
    this.router.navigate(['/usuarios/busca']);
  }
}