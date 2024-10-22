import { Injectable } from '@angular/core';
import { FirebaseAuthentication, User } from '@capacitor-firebase/authentication';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  nombreUsuario = '';
  usuarioActual = new BehaviorSubject<User | undefined>(undefined);

  //creamos un metodo que llamaremos cuando firebase efectivamente se haya cargado
  cargarFirebase!: () => void;

  //creamos una promesa que se resuelve cuando firebase se haya cargado
  firebaseCargado = new Promise<void>((resolve) => {
    this.cargarFirebase = resolve;
  });

  constructor() {
    // Dejamos un escucha al evento de cambio de estado de firebase
    // cuando firebase inicie la primera vez, este evento se llamará cuando este cargado
    FirebaseAuthentication.addListener('authStateChange', async (cambio) => {
      this.usuarioActual.next(cambio.user!);
      this.nombreUsuario = cambio.user?.email ?? '';
      // cuando llamemos este metodo, firebase ya estará cargado y el guard lo sabrá
      this.cargarFirebase();
    });
  }

  public async guardarDatosUsuario(datos: { nombreAlumno: string, modalidad: string, telefono: string, carrera: string }) {
    const user = this.usuario;  // Obtener el usuario actual
    if (user) {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}`,
        data: {
          email: user.email,
          nombreAlumno: datos.nombreAlumno,
          modalidad: datos.modalidad,
          telefono: datos.telefono,
          carrera: datos.carrera
        },
        merge: true
      });
    }
  }

  public get logeado() {
    return this.usuarioActual.value ? true : false;
  }

  // propiedad del usuario actual
  public get usuario() {
    return this.usuarioActual.value;
  }

  public async login(user: string, password: string) {
    const login = await FirebaseAuthentication.signInWithEmailAndPassword({
      email: user,
      password: password
    });
    this.usuarioActual.next(login.user!);
    this.nombreUsuario = login.user!.email!;
    console.log(login);
  }

  public async register(user: string, password: string) {
    const registro = await FirebaseAuthentication.createUserWithEmailAndPassword({
      email: user,
      password: password
    });
    this.usuarioActual.next(registro.user!);
    this.nombreUsuario = registro.user!.email!;
    console.log('Usuario registrado:', registro);
  }

  // Método para cerrar sesión
  public async logout() {
    await FirebaseAuthentication.signOut();
    this.usuarioActual.next(undefined); // Limpia el usuario actual
    this.nombreUsuario = ''; // Limpia el nombre de usuario
    console.log('Usuario cerrado de sesión');
  }

  public async eliminarCuenta() {
    const user = this.usuario;
    if (user) {
      try {
        await FirebaseAuthentication.deleteUser();  // Eliminar la cuenta de Firebase Auth
        await FirebaseFirestore.deleteDocument({
          reference: `profiles/${user.uid}`,  // Eliminar los datos del Firestore
        });
        this.usuarioActual.next(undefined); // Limpiar el usuario actual
        console.log('Cuenta eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        throw error;
      }
    }
  }
}
