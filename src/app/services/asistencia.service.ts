import { Injectable } from '@angular/core';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { InteractionService } from './interaction.service';
import { LoginService } from './login.service';

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

  async registrarAsistencia(datosQR: { seccion: string, code: string, fecha: number }) {
    const userId = this.loginService.usuario?.uid;

    if (userId) {
      try {
        const ramo = this.ramosPorSeccion[datosQR.seccion];

        if (!ramo) {
          this.interactionService.showToast("Sección no válida.");
          return false;
        }

        // Convertir la fecha de número a string
        const fechaString = datosQR.fecha.toString();

        // Convertir la fecha de formato 'YYYYMMDD' a 'YYYY-MM-DD'
        const fechaFormateada = `${fechaString.substring(0, 4)}-${fechaString.substring(4, 6)}-${fechaString.substring(6, 8)}`;
        const fechaMostrar = `${fechaString.substring(6, 8)}-${fechaString.substring(4, 6)}-${fechaString.substring(0, 4)}`; // Formato dd-mm-yyyy

        const dataToSend = {
          userId: userId,
          seccion: datosQR.seccion,
          ramo: ramo,
          code: datosQR.code,
          fecha: fechaFormateada,
          fechaMostrar: fechaMostrar,
          asistio: true
        };

        console.log("Datos que se enviarán a Firestore:", dataToSend);

        // Usando setDocument para crear o actualizar el documento
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
    } else {
      this.interactionService.showToast("Usuario no autenticado.");
      return false;
    }
  }


  async getAsistenciasUsuarioAgrupadas(): Promise<any> {
    const userId = this.loginService.usuario?.uid;

    if (userId) {
      try {
        // Obtiene la subcolección 'usuarios' de todas las secciones y fechas
        const { snapshots } = await FirebaseFirestore.getCollectionGroup({
          reference: `usuarios`, // Cambiado para apuntar a las subcolecciones llamadas 'usuarios'
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
          // Si no hay resultados, retornar un objeto vacío
          return {};
        }

        // Agrupar los datos por sección
        const asistenciasAgrupadas: any = {};

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
              fecha: fechaMostrar ? fechaMostrar : 'Fecha desconocida',
              asistio: asistio
            });
          }
        });

        return asistenciasAgrupadas;
      } catch (error) {
        console.error("Error al obtener asistencias:", error);
        this.interactionService.showToast("Error al obtener asistencias: " + (error as Error).message);
        return {};
      }
    } else {
      this.interactionService.showToast("Usuario no autenticado.");
      return {};
    }
  }








}
