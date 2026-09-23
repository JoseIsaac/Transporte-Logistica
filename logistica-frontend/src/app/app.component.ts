import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>🚚 Sistema de Logística de Transportes</h1>
    <router-outlet />
  `
})
export class AppComponent {
  title = 'logistica-frontend';
}