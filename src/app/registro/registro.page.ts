import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { InteractionService } from '../services/interaction.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  datosForm: FormGroup;
  loginSrv = inject(LoginService);
  interactionSrv = inject(InteractionService);
  navCtrl = inject(NavController);

  constructor(private fb: FormBuilder) {
    // Inicializar el FormGroup en el constructor
    this.datosForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validar email
      password: ['', [Validators.required, Validators.minLength(6)]],  // Validar password
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]]  // Confirmación de contraseña
    });
  }

  ngOnInit() {}

  async registrarse() {
    if (this.datosForm.valid) {
      const { email, password } = this.datosForm.value;

      // Mostrar alerta de confirmación
      const confirmacion = await this.interactionSrv.presentAlert(
        'Confirmar Registro',
        '¿Estás seguro de que deseas crear esta cuenta?',
        'Cancelar',
        'Registrar'
      );

      if (confirmacion) {  // Si el usuario confirma
        try {
          await this.interactionSrv.showLoading('Registrando usuario...');  // Mostrar loading
          await this.loginSrv.register(email, password);  // Llamada al servicio de registro
          await this.interactionSrv.dismissLoading();  // Ocultar loading

          // Mostrar mensaje toast de éxito
          await this.interactionSrv.showToast('Usuario registrado exitosamente');

          // Redirigir al home
          this.navCtrl.navigateRoot('/home');  // Cambiar a la página de inicio
        } catch (error) {
          await this.interactionSrv.dismissLoading();  // Ocultar loading en caso de error
          console.error('Error en el registro:', error);
          await this.interactionSrv.showToast('Error en el registro, inténtelo de nuevo');
        }
      }
    }
  }
}

