import { TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { InteractionService } from '../services/interaction.service';
import { ModalController } from '@ionic/angular';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { mockFirebaseAuth } from '../mocks/firebase.mock';
import { initializeApp } from 'firebase/app';

describe('LoginPage', () => {
  let component: LoginPage;
  let interactionServiceSpy: jasmine.SpyObj<InteractionService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Crear mocks
    const interactionServiceMock = jasmine.createSpyObj('InteractionService', ['showToast']);
    const modalControllerMock = jasmine.createSpyObj('ModalController', ['getTop']);

    // Configurar TestBed
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: InteractionService, useValue: interactionServiceMock },
        { provide: ModalController, useValue: modalControllerMock },
        { provide: FirebaseAuthentication, useValue: mockFirebaseAuth }, // Inyectar el mock
      ],
    }).compileComponents();

    // Crear instancia del componente
    component = TestBed.createComponent(LoginPage).componentInstance;
    interactionServiceSpy = TestBed.inject(InteractionService) as jasmine.SpyObj<InteractionService>;
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send password reset email', async () => {
    // Configurar el mock para simular éxito
    mockFirebaseAuth.sendPasswordResetEmail.and.returnValue(Promise.resolve());
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
    component.email = 'prueba@asd.com';

    await component.enviarCorreo();

    expect(interactionServiceSpy.showToast).toHaveBeenCalledWith('Correo de restablecimiento enviado', 3000, 'top');
  });



  it('should show error when password reset fails', async () => {
    // Configurar el mock para simular error
    mockFirebaseAuth.sendPasswordResetEmail.and.callFake(() => Promise.reject(new Error('Error')));
    component.email = 'prueba';

    await component.enviarCorreo();

    expect(interactionServiceSpy.showToast).toHaveBeenCalledWith(
      'Error al enviar el correo. Inténtalo de nuevo',
      3000,
      'top'
    );
  });
});
