import { Component, inject, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { InteractionService } from '../services/interaction.service';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario:string = '';
  pass:string = '';
  email: string = '';

  navController = inject(NavController);
  loginSrv = inject(LoginService);
  interactionService = inject(InteractionService);

  constructor(private modalController: ModalController) {
  }
  ngOnInit() {

  }

  //ocurre cuando se va a entrar a esta vista, antes de la animación
  ionViewWillEnter(): void {

  }

  //se ejecuta cuando ya se entró a la vista, despues de las animaciones
  async ionViewDidEnter() {
    this.usuario = '';
    this.pass = '';



  }

  async ingresar() {
    try {
      // Intentamos hacer login
      await this.loginSrv.login(this.usuario, this.pass);
      this.navController.navigateForward('/home');
      console.log('Ingresando');
    } catch (error) {
      // Si hay un error, mostramos el mensaje de advertencia
      this.interactionService.showToast('Usuario o contraseña incorrectos', 3000, 'top');
    }
  }

  async cerrarModal() {
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss();
    }
  }

  async enviarCorreo() {
    if (!this.email) {
      // Mostrar mensaje si el campo está vacío
      this.interactionService.showToast('Por favor, ingresa un correo válido', 3000, 'top');
      return;
    }

    try {
      // Usar FirebaseAuthentication para enviar el correo de restablecimiento
      await FirebaseAuthentication.sendPasswordResetEmail({ email: this.email });
      this.interactionService.showToast('Correo de restablecimiento enviado', 3000, 'top');
      this.email = ''; // Borrar el email del input
      this.cerrarModal(); // Cierra el modal después de enviar el correo
    } catch (error) {
      console.error('Error al enviar correo:', error);
      this.interactionService.showToast('Error al enviar el correo. Inténtalo de nuevo', 3000, 'top');
      this.email = ''; // Borrar el email del input en caso de error también
    }
  }



}
