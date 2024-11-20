import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crear un mock para LoginService
    const loginServiceMock = jasmine.createSpyObj('LoginService', ['firebaseCargado'], {
      logeado: false, // Define el getter como parte del mock
    });
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: LoginService, useValue: loginServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    loginServiceSpy.firebaseCargado = Promise.resolve();
  });

  it('should allow navigation if logged in', async () => {
    // Simular que logeado es true
    Object.defineProperty(loginServiceSpy, 'logeado', { get: () => true });

    const canActivate = await guard.canActivate();
    expect(canActivate).toBeTrue();
  });

  it('should navigate to login if not logged in', async () => {
    // Simular que logeado es false
    Object.defineProperty(loginServiceSpy, 'logeado', { get: () => false });

    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
