import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.css']
})
export class RutasComponent {
  titulo = 'Gestión de Rutas';
  descripcion = 'Origen, destino, seguimiento y tiempos de recorrido'; // ✅ Faltaba esto
}