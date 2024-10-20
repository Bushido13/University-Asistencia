import { Component, inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { NavController } from '@ionic/angular';
import { InteractionService } from '../services/interaction.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  navController = inject(NavController);
  loginSrv = inject(LoginService);
  interactionSrv = inject(InteractionService);
  constructor() {}

  ngOnInit() {
  }

  async cerrarSesion() {
    const confirmacion = await this.interactionSrv.presentAlert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar la sesión?',
      'Cancelar',
      'Cerrar Sesión'
    );

    if (confirmacion) {
      await this.loginSrv.logout();  // Cerrar sesión
      await this.interactionSrv.showToast('Sesión cerrada correctamente');
      this.navController.navigateRoot('/login');  // Redirigir a la página de login
    }
  }
}
