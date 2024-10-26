import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {

  Object = Object;
  asistenciasAgrupadas: any = {};

  constructor(private asistenciaService: AsistenciaService) { }

  async ngOnInit() {
    this.asistenciasAgrupadas = await this.asistenciaService.getAsistenciasUsuarioAgrupadas();
  }
}
