import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIfMobile());
  isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();
  
  constructor() {
    // Observar mudanças de tamanho da janela
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.isMobileSubject.next(this.checkIfMobile());
      });
  }
  
  checkIfMobile(): boolean {
    return window.innerWidth < 992;
  }
}