import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="rodape">
      <p>&copy; 2024 Cuidar+. Todos os direitos reservados.</p>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}