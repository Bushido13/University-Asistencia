import { Component, inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { MenuController, NavController } from '@ionic/angular';
import { InteractionService } from '../services/interaction.service';
import { PerfilService } from '../services/perfil.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  navController = inject(NavController);
  loginSrv = inject(LoginService);
  interactionSrv = inject(InteractionService);
  nombreAlumno: string | null = null;
  perfilSrv = inject(PerfilService);
  constructor(private menu: MenuController) {}

  ngOnInit() {
    this.cargarDatosPerfil();
    this.menu.close();
  }

  ionViewWillEnter() {
    this.menu.close(); // Cierra el menú al entrar en la vista
  }

  async cargarDatosPerfil() {
    const perfilData = await this.perfilSrv.getProfileData(); // Obtén los datos del perfil
    if (perfilData) {
      this.nombreAlumno = perfilData['nombre']; // Asigna el nombre del alumno a la variable
    }
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
