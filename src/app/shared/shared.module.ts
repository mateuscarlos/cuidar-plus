import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteAvatarComponent } from './components/paciente-avatar/paciente-avatar.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { AlertComponent } from './components/alert/alert.component';
import { PaginacaoComponent } from './components/paginacao/paginacao.component';
import { NotificacoesComponent } from './components/notificacoes/notificacoes.component';

// Lista de componentes compartilhados que serão exportados
const COMPONENTS = [
  PacienteAvatarComponent,
  StatusBadgeComponent,
  InfoCardComponent,
  AlertComponent,
  PaginacaoComponent,
  NotificacoesComponent
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class SharedModule { }