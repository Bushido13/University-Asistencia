import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { AsistenciaService } from '../services/asistencia.service';
import { BehaviorSubject } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let asistenciaServiceSpy: jasmine.SpyObj<AsistenciaService>;

  beforeEach(async () => {
    const asistenciaServiceMock = jasmine.createSpyObj('AsistenciaService', ['getAsistenciasUsuarioAgrupadas'], {
      ramosPorSeccion: { '1': 'Matemáticas', '2': 'Física' },
    });

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: AsistenciaService, useValue: asistenciaServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    asistenciaServiceSpy = TestBed.inject(AsistenciaService) as jasmine.SpyObj<AsistenciaService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate attendance percentages correctly', () => {
    const mockAsistencias = {
      '1': { asistencias: [{ asistio: true }, { asistio: true }, { asistio: false }] },
      '2': { asistencias: [{ asistio: true }, { asistio: false }] },
    };


    component.loadAttendanceChart(mockAsistencias);


    const expectedData = [67, 50];
    const calculatedData = component['attendanceChart']?.data.datasets[0].data;

    expect(calculatedData).toEqual(expectedData);
  });
});
