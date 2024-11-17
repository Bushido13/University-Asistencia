import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { AsistenciasAgrupadas } from '../models/asistencia.model';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {

  Object = Object;
  asistenciasAgrupadas: AsistenciasAgrupadas = {};

  constructor(private asistenciaService: AsistenciaService) { }

  async ngOnInit() {
    try {
      this.asistenciasAgrupadas = await this.asistenciaService.getAsistenciasUsuarioAgrupadas();
    } catch (error) {
      console.error("Error al cargar asistencias:", error);
    }
  }
}
