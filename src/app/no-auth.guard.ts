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
      return true;
    } else {

      this.router.navigate(['/home']);
      return false;
    }
  }
}
