import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class PasswordFormComponent implements OnInit {
  @Input() userId!: string;
  @Output() passwordSubmitted = new EventEmitter<string>();
  
  passwordForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  
  passwordStrength = {
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  };
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.createPasswordStrengthValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    
    // Monitor password changes to update strength indicators
    this.passwordForm.get('password')?.valueChanges.subscribe(
      (value: string) => this.checkPasswordStrength(value)
    );
  }
  
  private createPasswordStrengthValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
      
      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
      
      return !passwordValid ? { passwordStrength: true } : null;
    };
  }
  
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    return password && confirmPassword && password !== confirmPassword ? 
      { passwordMismatch: true } : null;
  }
  
  checkPasswordStrength(password: string): void {
    this.passwordStrength = {
      hasMinLength: password?.length >= 8,
      hasUpperCase: /[A-Z]+/.test(password),
      hasLowerCase: /[a-z]+/.test(password),
      hasNumber: /[0-9]+/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
    };
  }
  
  getPasswordStrengthPercentage(): number {
    const { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = this.passwordStrength;
    const criteriaCount = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
    return (criteriaCount / 5) * 100;
  }
  
  getPasswordStrengthClass(): string {
    const percentage = this.getPasswordStrengthPercentage();
    if (percentage <= 20) return 'bg-danger';
    if (percentage <= 40) return 'bg-warning';
    if (percentage <= 60) return 'bg-info';
    if (percentage <= 80) return 'bg-primary';
    return 'bg-success';
  }
  
  onSubmit(): void {
    if (this.passwordForm.valid) {
      const passwordControl = this.passwordForm.get('password');
      const hashedPassword = passwordControl ? Md5.hashStr(passwordControl.value) : '';
      this.passwordSubmitted.emit(hashedPassword);
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
  
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }
}
