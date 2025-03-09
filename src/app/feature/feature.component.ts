import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '<h1>Feature Component</h1>'
})
export class FeatureComponent { }
