import { Component, inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  navController = inject(NavController);
  loginSrv = inject(LoginService);
  constructor() {}

  ngOnInit() {
  }

  public cerrarSesion() {
    this.loginSrv.logout().then(() => {
      console.log('Sesión cerrada');
      // Redirigir al usuario a la página de login
      this.navController.navigateRoot('/login'); // Asegúrate de que la ruta coincida con la configuración de tu router
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
