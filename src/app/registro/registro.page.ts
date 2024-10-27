import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { InteractionService } from '../services/interaction.service';
import { NavController } from '@ionic/angular';
import { PerfilService } from '../services/perfil.service';

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
  perfilSrv = inject(PerfilService);

  constructor(private fb: FormBuilder) {
    // validamos los datos en FormGroup en el constructor
    this.datosForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      nombreAlumno: ['', Validators.required],
      modalidad: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      carrera: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async registrarse() {
    if (this.datosForm.valid) {
      const { email, password, nombreAlumno, modalidad, telefono, carrera } = this.datosForm.value;

      // Validar que no haya campos indefinidos
      if (!nombreAlumno || !modalidad || !telefono || !carrera) {
        console.error('Faltan datos del perfil');
        return await this.interactionSrv.showToast('Por favor completa todos los campos');
      }

      const confirmacion = await this.interactionSrv.presentAlert(
        'Confirmar Registro',
        '¿Estás seguro de que deseas crear esta cuenta?',
        'Cancelar',
        'Registrar'
      );

      if (confirmacion) {
        try {
          await this.interactionSrv.showLoading('Registrando usuario...');
          const usuarioRegistrado = await this.loginSrv.register(email, password);

          // Guarda los datos adicionales en el perfil
          await this.perfilSrv.saveProfileData({
            nombreAlumno,
            modalidad,
            telefono,

            carrera,


          });

          await this.interactionSrv.dismissLoading();
          await this.interactionSrv.showToast('Usuario registrado exitosamente');
          this.navCtrl.navigateRoot('/home');
        } catch (error) {
          await this.interactionSrv.dismissLoading();
          console.error('Error en el registro:', error);
          await this.interactionSrv.showToast('Error en el registro, inténtelo de nuevo');
        }
      }
    }
  }


}
