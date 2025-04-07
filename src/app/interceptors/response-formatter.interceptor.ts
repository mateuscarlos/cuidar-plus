import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Import the class properly
import { Patient } from '../features/pacientes/models/paciente.model';

@Injectable()
export class ResponseFormatterInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Verifica se é uma resposta relacionada a pacientes
          if (event.url?.includes('/pacientes')) {
            const body = event.body;
            
            if (Array.isArray(body)) {
              // Transformando lista de pacientes
              return event.clone({ 
                body: body.map(item => Patient.fromBackendResponse(item)) 
              });
            } else if (body && typeof body === 'object') {
              // Transformando um único paciente
              return event.clone({ 
                body: Patient.fromBackendResponse(body) 
              });
            }
          }
        }
        return event;
      })
    );
  }
}