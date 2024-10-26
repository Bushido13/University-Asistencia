import { Component, inject, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { BarcodeScanner } from 'capacitor-barcode-scanner';
import { InteractionService } from '../services/interaction.service';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-escaner',
  templateUrl: './escaner.page.html',
  styleUrls: ['./escaner.page.scss'],
})
export class EscanerPage implements OnInit {

  textoescaneado: string = '';
  ramo: string | undefined;
  interactionService = inject(InteractionService);
  asistenciaService = inject(AsistenciaService);
  navController = inject(NavController);

  constructor(
    private menu: MenuController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menu.close(); // Cierra el menú al entrar en la vista
  }

  async escanear() {
    const scanResultado = await BarcodeScanner.scan();

    if (scanResultado.result && scanResultado.code) {
      console.log("Contenido del QR escaneado:", scanResultado.code);

      try {
        const datosQR = JSON.parse(scanResultado.code);
        console.log("Datos del QR procesados:", datosQR); // Agregado para depuración

        // Mostrar spinner mientras se procesa la información
        await this.interactionService.showLoading('Procesando...');

        // Validación adicional de claves
        if (
          typeof datosQR.seccion === 'string' &&
          typeof datosQR.code === 'string' &&
          typeof datosQR.fecha === 'number'
        ) {
          console.log("Formato de QR correcto:", datosQR);
          this.textoescaneado = JSON.stringify(datosQR);

          this.ramo = this.asistenciaService.ramosPorSeccion[datosQR.seccion];

          if (!this.ramo) {
            this.interactionService.showToast('Sección no válida.');
            await this.interactionService.dismissLoading();
            return;
          }

          // Registrar la asistencia
          await this.asistenciaService.registrarAsistencia(datosQR);
          this.interactionService.showToast('QR escaneado con éxito');
          this.navController.navigateRoot('/home');
        } else {
          this.interactionService.showToast('Formato incorrecto en los datos del QR.');
        }
      } catch (error: any) {
        console.error("Error al procesar el QR:", error);
        this.interactionService.showToast('Error al procesar el QR: ' + error.message);
      } finally {
        // Ocultar el spinner
        await this.interactionService.dismissLoading();
      }
    } else {
      this.interactionService.showToast('No se detectó ningún código QR.');
    }
  }

}
