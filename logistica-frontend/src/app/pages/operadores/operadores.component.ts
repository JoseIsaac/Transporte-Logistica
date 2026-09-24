import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.css']
})
export class OperadoresComponent {
  titulo = '👷 Operadores';
}