import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private loginService: LoginService) {
    this.initializeApp();

  }
  initializeApp() {
    const prefersDark = localStorage.getItem('darkMode') === 'true';
    if (prefersDark) {
      document.body.classList.add('dark');
    }
  }



  async ngOnInit() {
    //veremos si no estamos en un celular
    if(!Capacitor.isNativePlatform()){

      const firebaseConfig = {
        apiKey: "AIzaSyDDfmEOK1pVsRaDQ3NgAvvshZ_RHP2cF88",
        authDomain: "university-asistencia.firebaseapp.com",
        projectId: "university-asistencia",
        storageBucket: "university-asistencia.appspot.com",
        messagingSenderId: "247638577400",
        appId: "1:247638577400:web:d372aa14e5f4391c232b0d",
        measurementId: "G-TC9DSMCZDN"
      };

      initializeApp(firebaseConfig)
      console.log('Firebase web initialized');
    }
}



}
