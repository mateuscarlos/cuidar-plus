import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DeviceDetectorService } from './core/services/device-detector.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cuidar-plus';
  isSidebarVisible = true;
  isMobile = false;
  private destroy$ = new Subject<void>();
  
  constructor(
    private router: Router,
    private deviceDetector: DeviceDetectorService
  ) {}
  
  ngOnInit() {
    // Escutar mudanças no tamanho da tela
    this.deviceDetector.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobile => {
        this.isMobile = isMobile;
        this.isSidebarVisible = !isMobile;
      });
    
    // Scroll to top when navigating to a new page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      window.scrollTo(0, 0);
      
      // Fechar sidebar em dispositivos móveis após navegação
      if (this.isMobile) {
        this.isSidebarVisible = false;
      }
    });
  }
  
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}