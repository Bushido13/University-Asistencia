import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, MenuController, NavController } from '@ionic/angular';

import { MenuComponent } from './menu.component';
import { Router } from '@angular/router';
import { InteractionService } from '../services/interaction.service';
import { LoginService } from '../services/login.service';
import { mockFirebaseAuth, mockFirebaseFirestore } from '../mocks/firebase.mock'; // Ajusta la ruta según tu estructura
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let interactionServiceSpy: jasmine.SpyObj<InteractionService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let menuControllerSpy: jasmine.SpyObj<MenuController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    // Crear mocks para los servicios
    const interactionServiceMock = jasmine.createSpyObj('InteractionService', ['presentAlert', 'showToast']);
    const loginServiceMock = jasmine.createSpyObj('LoginService', ['logout']);
    const navControllerMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
    const menuControllerMock = jasmine.createSpyObj('MenuController', ['close']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: InteractionService, useValue: interactionServiceMock },
        { provide: LoginService, useValue: loginServiceMock },
        { provide: NavController, useValue: navControllerMock },
        { provide: MenuController, useValue: menuControllerMock },
        { provide: Router, useValue: routerMock },
        { provide: FirebaseAuthentication, useValue: mockFirebaseAuth },
        { provide: FirebaseFirestore, useValue: mockFirebaseFirestore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Asignar los mocks a las variables para verificar interacciones
    interactionServiceSpy = TestBed.inject(InteractionService) as jasmine.SpyObj<InteractionService>;
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    navControllerSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
    menuControllerSpy = TestBed.inject(MenuController) as jasmine.SpyObj<MenuController>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close menu on navigateTo', () => {
    component.navigateTo('/test-route');
    expect(menuControllerSpy.close).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/test-route']);
  });

  it('should present alert and logout on cerrarSesion', async () => {
    interactionServiceSpy.presentAlert.and.returnValue(Promise.resolve(true)); // Simular confirmación positiva
    await component.cerrarSesion();
    expect(loginServiceSpy.logout).toHaveBeenCalled();
    expect(interactionServiceSpy.showToast).toHaveBeenCalledWith('Sesión cerrada correctamente');
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith('/login');
    expect(menuControllerSpy.close).toHaveBeenCalled();
  });

  it('should toggle dark mode on toggleDarkMode', () => {
    // Simular evento de toggle activado
    component.toggleDarkMode({ detail: { checked: true } });
    expect(document.body.classList.contains('dark')).toBeTrue();

    // Simular evento de toggle desactivado
    component.toggleDarkMode({ detail: { checked: false } });
    expect(document.body.classList.contains('dark')).toBeFalse();
  });
});

