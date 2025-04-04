import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  static requiredField(control: AbstractControl): ValidationErrors | null {
    return control.value ? null : { required: true };
  }

  static validEmail(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }

  static minLength(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length >= length
        ? null
        : { minLength: { requiredLength: length } };
    };
  }
}
