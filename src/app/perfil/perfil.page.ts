  import { Component, inject, OnInit } from '@angular/core';
  import { PerfilService } from '../services/perfil.service';
  import { InteractionService } from '../services/interaction.service';
  import { LoginService } from '../services/login.service';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { MenuController, NavController } from '@ionic/angular';

  @Component({
    selector: 'app-perfil',
    templateUrl: './perfil.page.html',
    styleUrls: ['./perfil.page.scss'],
  })



  export class PerfilPage implements OnInit {

    navController = inject(NavController);
    perfilForm: FormGroup;
    originalProfileData: any; // Para guardar los datos originales
    perfilService = inject(PerfilService);
    interactionService = inject(InteractionService);
    loginService = inject(LoginService);
    constructor(
      private menu: MenuController,
      private fb: FormBuilder
    ) {
      this.perfilForm = this.fb.group({
        nombreAlumno: ['', Validators.required],
        telefono: ['', Validators.required],
        carrera: ['', Validators.required],
        modalidad: ['', Validators.required],
        email: [{ value: this.loginService.usuario?.email || '', disabled: true }, [Validators.required, Validators.email]]
      });
    }

    ngOnInit() {
      this.loadProfileData();
    }

    ionViewWillEnter() {
      this.menu.close(); // Cierra el menú al entrar en la vista
    }







    async loadProfileData() {
      const data = await this.perfilService.getProfileData();
      if (data) {
        this.originalProfileData = { ...data }; // Guardar datos originales
        // Carga los datos en el formulario
        this.perfilForm.patchValue({
          nombreAlumno: data['nombre'], // Acceso correcto a la propiedad
          telefono: data['telefono'], // Acceso correcto a la propiedad
          carrera: data['carrera'], // Acceso correcto a la propiedad
          modalidad: data['modalidad'], // Acceso correcto a la propiedad
        });
      }
    }

    async actualizarPerfil() {
      const confirmed = await this.interactionService.presentAlert(
        'Confirmar',
        '¿Estás seguro de actualizar tu perfil?',
        'Cancelar',
        'Aceptar'
      );
      if (confirmed) {
        this.interactionService.showLoading('Actualizando...');
        try {
          await this.perfilService.updateProfileData(this.perfilForm.value);
          this.interactionService.showToast('Perfil actualizado con éxito');
          this.originalProfileData = { ...this.perfilForm.value }; // Actualiza los datos originales
        } catch (error) {
          this.interactionService.showToast('Error al actualizar el perfil');
        } finally {
          this.interactionService.dismissLoading();
        }
      }
    }



    // Método para confirmar y eliminar la cuenta
    async confirmarEliminacionCuenta() {
      const confirmed = await this.interactionService.presentAlert(
        'Eliminar cuenta',
        '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
        'Cancelar',
        'Eliminar'
      );
      if (confirmed) {
        this.deleteAccount();
      }
    }

    // Método para eliminar la cuenta
    async deleteAccount() {
      this.interactionService.showLoading('Eliminando cuenta...');
      try {
        // Elimina la cuenta de Firebase Auth
        await this.loginService.eliminarCuenta();
        // Elimina el perfil del usuario en Firestore
        await this.perfilService.deleteProfileData();
        this.interactionService.showToast('Cuenta eliminada con éxito');
        // Redirige al usuario a la pantalla de inicio de sesión o cualquier otra acción posterior
        this.navController.navigateRoot('/login');
      } catch (error) {
        this.interactionService.showToast('Error al eliminar la cuenta');
      } finally {
        this.interactionService.dismissLoading();
      }
    }
  }
