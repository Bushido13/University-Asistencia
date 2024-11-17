import { Injectable } from '@angular/core';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { InteractionService } from './interaction.service';
import { LoginService } from './login.service';
import { AsistenciasAgrupadas, Asistencia } from '../models/asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  public ramosPorSeccion: { [key: string]: string } = {
    'IN002': 'Inglés Intermedio',
    'AR004': 'Arquitectura',
    'PM001': 'Programación Móvil',
    'ED006': 'Estadística Descriptiva',
    'CS005': 'Calidad de Software',
    'ET009': 'Ética para el Trabajo'
  };

  constructor(private loginService: LoginService, private interactionService: InteractionService) {}

  private manejarError(error: any, mensaje: string): void {
    console.error(mensaje, error);
    this.interactionService.showToast(mensaje);
  }

  async registrarAsistencia(datosQR: { seccion: string; code: string; fecha: number }): Promise<boolean> {
    const userId = this.loginService.usuario?.uid;

    if (!userId) {
      this.interactionService.showToast("Usuario no autenticado.");
      return false;
    }

    try {
      const ramo = this.ramosPorSeccion[datosQR.seccion];

      if (!ramo) {
        this.interactionService.showToast("Sección no válida.");
        return false;
      }

      // Validar el formato de fecha
      if (!/^\d{8}$/.test(datosQR.fecha.toString())) {
        console.error('Formato de fecha incorrecto en datosQR.fecha:', datosQR.fecha);
        this.interactionService.showToast('Formato de fecha inválido en el QR.');
        return false;
      }

      const fechaString = datosQR.fecha.toString();
      const fechaFormateada = `${fechaString.substring(0, 4)}-${fechaString.substring(4, 6)}-${fechaString.substring(6, 8)}`;
      const fechaMostrar = `${fechaString.substring(6, 8)}-${fechaString.substring(4, 6)}-${fechaString.substring(0, 4)}`;

      console.log('fechaString:', fechaString);
      console.log('fechaFormateada:', fechaFormateada);
      console.log('fechaMostrar:', fechaMostrar);

      const dataToSend = {
        userId: userId,
        seccion: datosQR.seccion,
        ramo: ramo,
        code: datosQR.code,
        fecha: fechaFormateada, // Guardar en formato 'YYYY-MM-DD'
        fechaMostrar: fechaMostrar, // Formato 'DD-MM-YYYY' para mostrar
        asistio: true
      };

      await FirebaseFirestore.setDocument({
        reference: `asistencias/${datosQR.seccion}/fechas/${fechaFormateada}/usuarios/${userId}`,
        data: dataToSend,
        merge: true
      });

      console.log("Asistencia registrada correctamente");
      this.interactionService.showToast("Asistencia registrada correctamente.");
      return true;

    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      this.interactionService.showToast("Error al registrar asistencia: " + (error as Error).message);
      return false;
    }
  }


  async getAsistenciasUsuarioAgrupadas(): Promise<AsistenciasAgrupadas> {
    const userId = this.loginService.usuario?.uid;

    if (!userId) {
      this.interactionService.showToast("Usuario no autenticado.");
      return {};
    }

    try {
      const { snapshots } = await FirebaseFirestore.getCollectionGroup({
        reference: `usuarios`,
        compositeFilter: {
          type: 'and',
          queryConstraints: [
            {
              type: 'where',
              fieldPath: 'userId',
              opStr: '==',
              value: userId
            }
          ]
        }
      });

      if (!snapshots || snapshots.length === 0) {
        return {};
      }

      const asistenciasAgrupadas: AsistenciasAgrupadas = {};

      snapshots.forEach(snapshot => {
        const data = snapshot.data;

        if (data) {
          const seccion = data['seccion'];
          const fechaMostrar = data['fechaMostrar'];
          const asistio = typeof data['asistio'] !== 'undefined' ? data['asistio'] : false;
          const ramo = data['ramo'] ? data['ramo'] : this.ramosPorSeccion[seccion] || 'Ramo desconocido';

          if (!asistenciasAgrupadas[seccion]) {
            asistenciasAgrupadas[seccion] = {
              ramo: ramo,
              asistencias: []
            };
          }

          asistenciasAgrupadas[seccion].asistencias.push({
            fecha: fechaMostrar || 'Fecha desconocida',
            asistio: asistio
          });
        }
      });

      return asistenciasAgrupadas;
    } catch (error) {
      this.manejarError(error, "Error al obtener asistencias.");
      return {};
    }
  }
}
