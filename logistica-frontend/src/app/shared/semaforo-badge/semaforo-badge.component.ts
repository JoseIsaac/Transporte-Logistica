import { Component, Input } from '@angular/core';
import { EstadoSemaforo } from '../../core/models/unidad.model';

@Component({
  selector: 'app-semaforo-badge',
  standalone: true,
  templateUrl: './semaforo-badge.component.html',
  styleUrl: './semaforo-badge.component.css'
})
export class SemaforoBadgeComponent {
  @Input() estado!: EstadoSemaforo;

  obtenerClase(): string {
    switch (this.estado) {
      case 'VERDE': return 'verde';
      case 'AMARILLO': return 'amarillo';
      case 'ROJO': return 'rojo';
      default: return '';
    }
  }
}