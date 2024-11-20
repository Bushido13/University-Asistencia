import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsistenciasPage } from './asistencias.page';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // Necesario para ngIf y ngFor

describe('AsistenciasPage', () => {
  let component: AsistenciasPage;
  let fixture: ComponentFixture<AsistenciasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsistenciasPage],
      imports: [IonicModule.forRoot(), CommonModule], // Importa los módulos necesarios
    }).compileComponents();

    fixture = TestBed.createComponent(AsistenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
