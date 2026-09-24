import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoSemaforo } from '../../core/models/unidad.model';

@Component({
  selector: 'app-semaforo-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './semaforo-badge.component.html',
  styleUrls: ['./semaforo-badge.component.css'] // ✅ Con "s" al final
})
export class SemaforoBadgeComponent {
  @Input() estado?: EstadoSemaforo;

  obtenerClase(): string {
    switch (this.estado) {
      case 'VERDE': return 'verde';
      case 'AMARILLO': return 'amarillo';
      case 'ROJO': return 'rojo';
      default: return '';
    }
  }
}