import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { MenuController, NavController } from '@ionic/angular';
import { InteractionService } from '../services/interaction.service';
import { PerfilService } from '../services/perfil.service';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  navController = inject(NavController);
  loginSrv = inject(LoginService);
  interactionSrv = inject(InteractionService);
  perfilSrv = inject(PerfilService);
  asistenciaService = inject(AsistenciaService);

  nombreAlumno: string | null = null;
  frasesMotivacionales = [
    '¡Sigue así, tu dedicación te llevará lejos!',
    'Cada clase cuenta, ¡no te detengas!',
    'Tu asistencia es el primer paso hacia el éxito.',
    '¡Vas por buen camino, sigue asistiendo!',
  ];
  fraseMotivacional: string = '';
  private attendanceChart: Chart<'doughnut', number[], string> | null = null;

  constructor(private menu: MenuController) {
    // Registrar los elementos y controladores que necesitamos
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
  }

  async ngOnInit() {
    this.cargarDatosPerfil();
    this.recargarGraficoAsistencias();

    setTimeout(() => {
      this.obtenerFraseMotivacional();
    }, 0);
  }

  obtenerFraseMotivacional() {
    this.fraseMotivacional = this.frasesMotivacionales[
      Math.floor(Math.random() * this.frasesMotivacionales.length)
    ];
  }

  async recargarGraficoAsistencias() {
    try {
      const asistencias = await this.asistenciaService.getAsistenciasUsuarioAgrupadas();
      this.loadAttendanceChart(asistencias);
    } catch (error) {
      console.error('Error al recargar el gráfico de asistencias:', error);
    }
  }

  loadAttendanceChart(asistencias: any) {
    if (!asistencias || Object.keys(asistencias).length === 0) {
      console.log('No hay datos de asistencia para mostrar el gráfico.');
      return;
    }

    const labels = Object.keys(asistencias).map((key) => {
      return this.asistenciaService.ramosPorSeccion[key] || key;
    });

    const data = Object.keys(asistencias).map((label) => {
      const asistenciasTotales = asistencias[label].asistencias.length;
      const asistenciasPresentes = asistencias[label].asistencias.filter((a: any) => a.asistio).length;
      return Math.round((asistenciasPresentes / asistenciasTotales) * 100);
    });

    const ctx = (document.getElementById('attendanceChart') as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      // Destruir el gráfico anterior si existe
      if (this.attendanceChart) {
        this.attendanceChart.destroy();
      }

      // Crear un nuevo gráfico
      this.attendanceChart = new Chart<'doughnut', number[], string>(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: document.body.classList.contains('dark')
                ? ['#4444FF', '#FF4444', '#44FF44', '#FFFF44', '#8844FF', '#FF8844']
                : ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56', '#9966FF', '#FF9F40'],
              borderColor: 'transparent',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#e39a12',
              },
            },
            tooltip: {
              backgroundColor: '#575757',
              titleColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
            },
          },
          layout: {
            padding: 10,
          },
        },
      });
    }
  }

  ionViewWillEnter() {
    console.log('Entrando a Home, cerrando menú');
    this.menu.close();
    this.recargarGraficoAsistencias();
  }

  async cargarDatosPerfil() {
    const perfilData = await this.perfilSrv.getProfileData();
    if (perfilData) {
      this.nombreAlumno = perfilData['nombre'];
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
      await this.loginSrv.logout();
      await this.interactionSrv.showToast('Sesión cerrada correctamente');
      this.navController.navigateRoot('/login');
    }
  }
}
