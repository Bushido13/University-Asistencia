import { Injectable } from '@angular/core';
import { FirebaseAuthentication, User } from '@capacitor-firebase/authentication';
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
}
