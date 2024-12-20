import { Injectable } from '@angular/core';
import { FirebaseAuthentication, User } from '@capacitor-firebase/authentication';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

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

    this.getUsuario();
    // Dejamos un escucha al evento de cambio de estado de firebase
    // cuando firebase inicie la primera vez, este evento se llamará cuando este cargado
    FirebaseAuthentication.addListener('authStateChange', async (cambio) => {
      if (cambio.user) {
        await this.setUsuario(cambio.user);
      } else {
        await this.removeUsuario();
      }
      this.usuarioActual.next(cambio.user!);
      this.nombreUsuario = cambio.user?.email ?? '';
      // cuando llamemos este metodo, firebase ya estará cargado y el guard lo sabrá
      this.cargarFirebase();
    });
  }

  private async setUsuario(user: User) {
    await Preferences.set({
      key: 'usuario',
      value: JSON.stringify(user),
    });
  }

  private async getUsuario() {
    const { value } = await Preferences.get({ key: 'usuario' });
    if (value) {
      const user: User = JSON.parse(value);
      this.usuarioActual.next(user);
      this.nombreUsuario = user.email ?? '';
    }
  }

  private async removeUsuario() {
    await Preferences.remove({ key: 'usuario' });
    this.usuarioActual.next(undefined);
    this.nombreUsuario = '';
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

  // usuario actual
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
    this.usuarioActual.next(undefined);
    this.nombreUsuario = '';
    console.log('Usuario cerrado de sesión');
  }

  public async eliminarCuenta() {
    const user = this.usuario;
    if (user) {
      try {
        await FirebaseAuthentication.deleteUser();
        await FirebaseFirestore.deleteDocument({
          reference: `profiles/${user.uid}`,
        });
        this.usuarioActual.next(undefined);
        console.log('Cuenta eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        throw error;
      }
    }
  }


}
