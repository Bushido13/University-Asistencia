import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './services/login.service'; // Asegúrate de importar el LoginService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Esperar a que Firebase cargue si es necesario
    await this.loginService.firebaseCargado;

    if (this.loginService.logeado) {
      return true; // El usuario está autenticado
    } else {
      // Redirigir al login si el usuario no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}
