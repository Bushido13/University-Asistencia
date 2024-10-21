import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  loginSrv = inject(LoginService);
  constructor() { }

  async saveProfileData(data: any) {
    const userId = this.loginSrv.usuario?.uid; // Acceder al ID del usuario autenticado
    if (userId) {
      // Guardar los datos en Firestore, usando el ID del usuario
      await FirebaseFirestore.setDocument({
        reference: `profiles/${userId}`,
        data: {
          nombre: data.nombreAlumno,
          telefono: data.telefono,
          modalidad: data.modalidad,
          carrera: data.carrera,


        },
      });
    }
  }

   // Leer los datos del perfil del usuario
   async getProfileData() {
    const userId = this.loginSrv.usuario?.uid; // Acceder al ID del usuario autenticado
    if (userId) {
      const { snapshot } = await FirebaseFirestore.getDocument({
        reference: `profiles/${userId}`,
      });

      // Verificar si snapshot no es nulo
      if (snapshot) {
        // Asegúrate de que snapshot.data es un objeto de tipo DocumentData
        return snapshot.data || null; // Retorna los datos del perfil o null
      }
    }
    return null; // Retorna null si no hay usuario autenticado
  }

  // Actualizar el perfil del usuario
  async updateProfileData(data: any) {
    const userId = this.loginSrv.usuario?.uid; // Acceder al ID del usuario autenticado
    if (userId) {
      await FirebaseFirestore.updateDocument({
        reference: `profiles/${userId}`,
        data: {
          nombre: data.nombreAlumno,
          telefono: data.telefono,
          modalidad: data.modalidad,
          carrera: data.carrera,
        },
      });
    }
  }

  // Eliminar el perfil del usuario
  async deleteProfileData() {
    const userId = this.loginSrv.usuario?.uid; // Acceder al ID del usuario autenticado
    if (userId) {
      await FirebaseFirestore.deleteDocument({
        reference: `profiles/${userId}`,
      });
    }
  }
}

