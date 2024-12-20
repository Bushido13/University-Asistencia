import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../services/interaction.service';
import { LoginService } from '../services/login.service';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(
    private interactionService: InteractionService,
    private loginService: LoginService,
    private navController: NavController,
    private menu: MenuController,
    private router: Router,
  ) {}

  ngOnInit() {}

  async cerrarSesion() {
    const confirmacion = await this.interactionService.presentAlert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar la sesión?',
      'Cancelar',
      'Cerrar Sesión'
    );

    if (confirmacion) {
      await this.loginService.logout();
      await this.interactionService.showToast('Sesión cerrada correctamente');
      this.navController.navigateRoot('/login');
    }
    this.menu.close();
  }

  navigateTo(route: string) {

    if (this.router.url === route) {
      this.menu.close();
    } else {
      this.router.navigate([route]);
      this.menu.close();
    }
  }

  toggleDarkMode(event: any) {
    if (event.detail.checked) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
