import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.loginService.firebaseCargado;

    if (!this.loginService.logeado) {
      return true; // El usuario no está autenticado, puede ver login y registro
    } else {
      // Si está autenticado, redirige al home
      this.router.navigate(['/home']);
      return false;
    }
  }
}
