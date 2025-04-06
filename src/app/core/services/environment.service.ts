import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  
  get isProduction(): boolean {
    return environment.production;
  }
  
  get isTesting(): boolean {
    return environment.testing;
  }
  
  get isDevelopment(): boolean {
    return !environment.production && !environment.testing;
  }
  
  get apiUrl(): string {
    return environment.apiUrl;
  }
  
  get logLevel(): string {
    return environment.logLevel;
  }
  
  get isMockEnabled(): boolean {
    return environment.mockEnabled;
  }
  
  constructor() {
    // Log the current environment during service initialization
    if (!environment.production) {
      console.log(`Running in ${this.getEnvironmentName()} mode`);
      console.log(`API URL: ${environment.apiUrl}`);
      console.log(`Mock Enabled: ${environment.mockEnabled}`);
    }
  }
  
  private getEnvironmentName(): string {
    if (environment.production) return 'Production';
    if (environment.testing) return 'Testing';
    return 'Development';
  }
}