import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario:string = '';
  pass:string = '';

  navController = inject(NavController);
  loginSrv = inject(LoginService);
  constructor() {
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

  async ingresar(){


    await this.loginSrv.login(this.usuario,this.pass);
    this.navController.navigateForward('/home');
    console.log('Ingresando');
  }

}
